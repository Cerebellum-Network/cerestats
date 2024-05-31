<template>
  <div>
    <section>
      <b-container class="main py-5">
        <b-row class="mb-2">
          <b-col cols="12">
            <h1>
              {{ $t('pages.cluster.cluster_dashboard') }}
              <small v-if="totalRows !== 1" class="ml-1" style="font-size: 1rem"
                >[{{ formatNumber(totalRows) }}]</small
              >
            </h1>
          </b-col>
        </b-row>
        <b-container class="main mb-5 p-0">
          <b-row>
            <b-col>
              <div class="widget mb-4">
                <div class="col-10">
                  <h5 class="widget-title mb-2">
                    {{ $t('pages.cluster.cluster_id') }}
                  </h5>
                  <h5>1234</h5>
                </div>
              </div>
            </b-col>
            <b-col>
              <div class="widget mb-4">
                <div class="col-10">
                  <h5 class="widget-title mb-2">
                    {{ $t('pages.cluster.nodes') }}
                  </h5>
                  <h5>1234</h5>
                </div>
              </div>
            </b-col>
            <b-col>
              <div class="widget mb-4">
                <div class="col-10">
                  <h5 class="widget-title mb-2">
                    {{ $t('pages.cluster.tier') }}
                  </h5>
                  <h5>1234</h5>
                </div>
              </div>
            </b-col>
            <b-col>
              <div class="widget mb-4">
                <div class="col-10">
                  <h5 class="widget-title mb-2">
                    {{ $t('pages.cluster.throughput') }}
                  </h5>
                  <h5>1234</h5>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
        <div v-if="loading" class="text-center py-4">
          <Loading />
        </div>
        <template v-else>
          <!-- Filter -->
          <b-row>
            <b-col lg="12" class="mb-3">
              <b-input-group size="xl" class="mb-2">
                <b-input-group-prepend is-text>
                  <font-awesome-icon icon="search" />
                </b-input-group-prepend>
                <b-form-input
                  id="filterInput"
                  v-model="filter"
                  type="search"
                  :placeholder="$t('pages.cluster.search_placeholder')"
                />
              </b-input-group>
            </b-col>
          </b-row>
          <div>
            <b-table
              id="accounts-table"
              striped
              stacked="md"
              :fields="fields"
              :items="nodes"
            >
              <template #cell(rank)="data">
                <p class="text-right mb-0">#{{ data.item.rank }}</p>
              </template>
              <template #cell(account_id)="data">
                <div
                  class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center"
                >
                  <p class="mb-2">
                    {{ $t('pages.accounts.rank') }} #{{ data.item.rank }}
                  </p>
                  <Identicon :address="data.item.account_id" :size="40" />
                  <nuxt-link
                    :to="`/account/${data.item.account_id}`"
                    :title="$t('pages.accounts.account_details')"
                  >
                    <h4>{{ shortAddress(data.item.node_id) }}</h4>
                  </nuxt-link>
                  <p v-if="data.item.identity_display" class="mb-0">
                    {{ data.item.identity_display }}
                  </p>
                  <table class="table table-striped mt-4">
                    <tbody>
                      <tr>
                        <td class="text-left">
                          <strong>{{
                            $t('pages.accounts.free_balance')
                          }}</strong>
                        </td>
                        <td class="text-right">
                          {{ formatAmount(data.item.node_type) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left">
                          <strong>{{
                            $t('pages.accounts.available_balance')
                          }}</strong>
                        </td>
                        <td class="text-right">
                          {{ formatAmount(data.item.available_balance) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left">
                          <strong>{{
                            $t('pages.accounts.locked_balance')
                          }}</strong>
                        </td>
                        <td class="text-right">
                          {{ formatAmount(data.item.locked_balance) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
                  <Identicon :address="data.item.account_id" :size="20" />
                  <nuxt-link
                    v-b-tooltip.hover
                    :to="`/account/${data.item.account_id}`"
                    :title="$t('pages.accounts.account_details')"
                  >
                    {{ shortAddress(data.item.node_id) }}
                  </nuxt-link>
                </div>
              </template>
              <template #cell(free_balance)="data">
                <p class="text-right mb-0">
                  {{ formatAmount(data.item.free_balance) }}
                </p>
              </template>
              <template #cell(locked_balance)="data">
                <p class="text-right mb-0">
                  {{ formatAmount(data.item.locked_balance) }}
                </p>
              </template>
              <template #cell(available_balance)="data">
                <p class="text-right mb-0">
                  {{ formatAmount(data.item.available_balance) }}
                </p>
              </template>
              <template #cell(favorite)="data">
                <p class="text-center mb-0">
                  <a
                    class="favorite"
                    @click="toggleFavorite(data.item.account_id)"
                  >
                    <font-awesome-icon
                      v-if="data.item.favorite"
                      v-b-tooltip.hover
                      icon="star"
                      style="color: #f1bd23; cursor: pointer"
                      :title="$t('pages.accounts.remove_from_favorites')"
                    />
                    <font-awesome-icon
                      v-else
                      v-b-tooltip.hover
                      icon="star"
                      style="color: #e6dfdf; cursor: pointer"
                      :title="$t('pages.accounts.add_to_favorites')"
                    />
                  </a>
                </p>
              </template>
            </b-table>
          </div>
          <!-- pagination -->
          <div class="row">
            <div class="col-6">
              <!-- desktop -->
              <div class="d-none d-sm-none d-md-none d-lg-block d-xl-block">
                <b-button-group>
                  <b-button
                    v-for="(option, index) in paginationOptions"
                    :key="index"
                    :class="{ 'selected-per-page': perPage === option }"
                    variant="outline-primary2"
                    @click="setPageSize(option)"
                  >
                    {{ option }}
                  </b-button>
                </b-button-group>
              </div>
              <!-- mobile -->
              <div class="d-block d-sm-block d-md-block d-lg-none d-xl-none">
                <b-dropdown
                  class="m-md-2"
                  text="Page size"
                  variant="outline-primary2"
                >
                  <b-dropdown-item
                    v-for="(option, index) in paginationOptions"
                    :key="index"
                    @click="setPageSize(10)"
                  >
                    {{ option }}
                  </b-dropdown-item>
                </b-dropdown>
              </div>
            </div>
            <div class="col-6">
              <b-pagination
                v-model="currentPage"
                :total-rows="totalRows"
                :per-page="perPage"
                aria-controls="my-table"
                variant="dark"
                align="right"
              ></b-pagination>
            </div>
          </div>
        </template>
      </b-container>
    </section>
  </div>
</template>
<script>
import { gql } from 'graphql-tag'
import Identicon from '@/components/Identicon.vue'
import Loading from '@/components/Loading.vue'
import commonMixin from '@/mixins/commonMixin.js'
import { network, paginationOptions } from '@/frontend.config.js'

export default {
  components: {
    Loading,
    Identicon,
  },
  mixins: [commonMixin],
  data() {
    return {
      loading: true,
      paginationOptions,
      perPage: localStorage.paginationOptions
        ? parseInt(localStorage.paginationOptions)
        : 10,
      currentPage: 1,
      sortBy: `favorite`,
      sortDesc: true,
      filter: null,
      filterOn: [],
      totalRows: 1,
      agggregateRows: 1,
      fields: [
        {
          key: 'node_id',
          label: this.$t('pages.cluster.node_id'),
          sortable: true,
        },
        {
          key: 'node_type',
          label: this.$t('pages.cluster.node_type'),
          sortable: true,
        },
        {
          key: 'node_provider_reward',
          label: this.$t('pages.cluster.rewards'),
          sortable: true,
        },
        {
          key: 'gets',
          label: this.$t('pages.cluster.gets'),
          sortable: true,
        },
        {
          key: 'puts',
          label: this.$t('pages.cluster.puts'),
          sortable: true,
        },
      ],
      nodes: [],
      clusterId: this.$route.params.id,
    }
  },
  head() {
    return {
      title: this.$t('pages.accounts.head_title', {
        networkName: network.name,
      }),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.$t('pages.accounts.head_content', {
            networkName: network.name,
          }),
        },
      ],
    }
  },
  methods: {
    setPageSize(num) {
      localStorage.paginationOptions = num
      this.perPage = parseInt(num)
    },
  },
  watch: {
    $route() {
      this.clusterId = this.$route.params.id
    },
  },
  apollo: {
    $subscribe: {
      node_stats: {
        query: gql`
          query node_stats(
            $clusterId: String
            $nodeId: String
            $perPage: Int!
            $offset: Int!
          ) {
            node_stats(
              limit: $perPage
              offset: $offset
              where: {
                node_id: { _eq: $nodeId }
                cluster_id: { _eq: $clusterId }
              }
              order_by: { node_provider_reward: desc }
            ) {
              node_id
              node_type
              node_provider_reward
              gets
              puts
            }
          }
        `,
        variables() {
          console.log(this.clusterId)
          return {
            clusterId: this.clusterId,
            nodeId: this.filter ? this.filter : undefined,
            perPage: this.perPage,
            offset: (this.currentPage - 1) * this.perPage,
          }
        },
        result({ data }) {
          this.nodes = data.node_stats
          if (this.filter) {
            this.totalRows = this.nodes.length
          } else {
            this.totalRows = this.agggregateRows
          }
          this.loading = false
        },
      },
      count: {
        query: gql`
          query count {
            node_stats_aggregate {
              aggregate {
                count
              }
            }
          }
        `,
        result({ data }) {
          this.agggregateRows = data.node_stats_aggregate.aggregate.count
          if (!this.filter) {
            this.totalRows = this.agggregateRows
          }
        },
      },
    },
  },
}
</script>
