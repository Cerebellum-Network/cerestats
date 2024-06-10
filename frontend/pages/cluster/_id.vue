<template>
  <div>
    <section>
      <b-container class="page-cluster main py-5">
        <b-row class="mb-2">
          <b-col cols="12">
            <h1>
              {{ $t('pages.cluster.cluster_dashboard') }}
            </h1>
          </b-col>
        </b-row>
        <b-container class="main mb-5 p-0">
          <b-row>
            <b-col>
              <div class="widget mw240 mb-4">
                <div class="col-10">
                  <h5 class="widget-title mb-2">
                    {{ $t('pages.cluster.cluster_id') }}
                  </h5>
                  <h5>
                    <Identicon :address="clusterId" :size="20" />
                    <nuxt-link
                      :to="`/account/${clusterId}`"
                      :title="$t('pages.cluster.node_provider_id')"
                    >
                      {{ shortAddress(clusterId) }}
                    </nuxt-link>
                  </h5>
                </div>
              </div>
            </b-col>
            <b-col>
              <div class="widget mb-4">
                <div class="col-10">
                  <h5 class="widget-title mb-2">
                    {{ $t('pages.cluster.providers') }}
                  </h5>
                  <h5>
                    {{ providersNumber }}
                  </h5>
                </div>
              </div>
            </b-col>
            <b-col>
              <div class="widget mw240 mb-4">
                <div class="col-10">
                  <h5 class="widget-title mb-2">
                    {{ $t('pages.cluster.throughput') }}
                  </h5>
                  <h5>{{ transferred_bytes }}</h5>
                </div>
              </div>
            </b-col>
          </b-row>
        </b-container>
        <div v-if="loading" class="text-center py-4">
          <Loading />
        </div>
        <template v-else>
          <div>
            <b-table
              id="cluster-table"
              striped
              stacked="md"
              :fields="fields"
              :items="clusterStats"
            >
              <template #cell(node_provider_id)="data">
                <div
                  class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center"
                >
                  <Identicon :address="data.item.node_provider_id" :size="40" />
                  <nuxt-link
                    :to="`/account/${data.item.node_provider_id}`"
                    :title="$t('pages.cluster.node_provider_id')"
                  >
                    {{ shortAddress(data.item.node_provider_id) }}
                  </nuxt-link>
                  <table class="table table-striped mt-4">
                    <tbody>
                      <tr>
                        <td class="text-left">
                          <strong>{{ $t('pages.cluster.rewards') }}</strong>
                        </td>
                        <td class="text-right">
                          {{ formatAmount(data.item.rewarded, 6) }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left">
                          <strong>{{ $t('pages.cluster.gets') }}</strong>
                        </td>
                        <td class="text-right">
                          {{ data.item.number_of_gets }}
                        </td>
                      </tr>
                      <tr>
                        <td class="text-left">
                          <strong>{{ $t('pages.cluster.puts') }}</strong>
                        </td>
                        <td class="text-right">
                          {{ data.item.number_of_puts }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="d-none d-sm-none d-md-block d-lg-block d-xl-block">
                  <div>
                    <Identicon
                      :address="data.item.node_provider_id"
                      :size="20"
                    />
                    <nuxt-link
                      v-b-tooltip.hover
                      :to="`/account/${data.item.node_provider_id}`"
                      :title="$t('pages.cluster.node_provider_id')"
                    >
                      {{ shortAddress(data.item.node_provider_id) }}
                    </nuxt-link>
                  </div>
                </div>
              </template>
              <template #cell(rewarded)="data">
                <p class="text-right mb-0">
                  {{ formatAmount(data.item.rewarded, 6) }}
                </p>
              </template>
              <template #cell(number_of_gets)="data">
                <p class="text-right mb-0">{{ data.item.number_of_gets }}</p>
              </template>
              <template #cell(number_of_puts)="data">
                <p class="text-right mb-0">{{ data.item.number_of_puts }}</p>
              </template>
            </b-table>
          </div>
        </template>
      </b-container>
    </section>
    <div>
      <section>
        <b-container class="main py-5">
          <b-row class="mb-2">
            <b-col cols="12">
              <h1>
                {{ $t('pages.cluster.historical_rewards') }}
              </h1>
            </b-col>
          </b-row>
          <div class="last-extrinsics">
            <div v-if="loading" class="text-center py-4">
              <Loading />
            </div>
            <template v-else>
              <div class="table-responsive">
                <b-table
                  id="rewards-table"
                  striped
                  hover
                  :fields="rewardsFields"
                  :items="rewards"
                >
                  <template #cell(provider)="data">
                    <div
                      class="d-block d-sm-block d-md-none d-lg-none d-xl-none text-center"
                    >
                      <Identicon
                        :address="data.item.node_provider_id"
                        :size="40"
                      />
                      <nuxt-link
                        :to="`/account/${data.item.node_provider_id}`"
                        :title="$t('pages.cluster.provider')"
                      >
                        {{ shortAddress(data.item.node_provider_id) }}
                      </nuxt-link>
                      <table class="table table-striped mt-4">
                        <tbody>
                          <tr>
                            <td class="text-left">
                              <strong>{{ $t('pages.cluster.block') }}</strong>
                            </td>
                            <td class="text-right">
                              <nuxt-link
                                v-b-tooltip.hover.bottom
                                :to="`/block?blockNumber=${data.item.block_number}`"
                                title="Check block information"
                              >
                                #{{ formatNumber(data.item.block_number, 6) }}
                              </nuxt-link>
                            </td>
                          </tr>
                          <tr>
                            <td class="text-left">
                              <strong>{{ $t('pages.cluster.event') }}</strong>
                            </td>
                            <td class="text-right">
                              {{ data.item.event_index }}
                            </td>
                          </tr>
                          <tr>
                            <td class="text-left">
                              <strong>{{ $t('pages.cluster.era') }}</strong>
                            </td>
                            <td class="text-right">
                              {{ data.item.era }}
                            </td>
                          </tr>
                          <tr>
                            <td class="text-left">
                              <strong>{{
                                $t('pages.cluster.reward_amount')
                              }}</strong>
                            </td>
                            <td class="text-right">
                              {{ formatAmount(data.item.rewarded, 6) }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div
                      class="d-none d-sm-none d-md-block d-lg-block d-xl-block"
                    >
                      <Identicon
                        :address="data.item.node_provider_id"
                        :size="20"
                      />
                      <nuxt-link
                        :to="`/account/${data.item.node_provider_id}`"
                        :title="$t('pages.cluster.node_provider_id')"
                      >
                        {{ shortAddress(data.item.node_provider_id) }}
                      </nuxt-link>
                    </div>
                  </template>
                  <template #cell(block)="data">
                    <div class="text-right mb-0">
                      <nuxt-link
                        v-b-tooltip.hover.bottom
                        :to="`/block?blockNumber=${data.item.block_number}`"
                        title="Check block information"
                      >
                        #{{ formatNumber(data.item.block_number, 6) }}
                      </nuxt-link>
                    </div>
                  </template>
                  <template #cell(event)="data">
                    <p class="text-right mb-0">
                      {{ data.item.event_index }}
                    </p>
                  </template>
                  <template #cell(era)="data">
                    <p class="text-right mb-0">
                      {{ data.item.era }}
                    </p>
                  </template>
                  <template #cell(reward)="data">
                    <p class="text-right mb-0">
                      {{ formatAmount(data.item.rewarded, 6) }}
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
                        variant="outline-primary2"
                        :class="{ 'selected-per-page': perPage === option }"
                        @click="setPageSize(option)"
                      >
                        {{ option }}
                      </b-button>
                    </b-button-group>
                  </div>
                  <!-- mobile -->
                  <div
                    class="d-block d-sm-block d-md-block d-lg-none d-xl-none"
                  >
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
          </div>
        </b-container>
      </section>
    </div>
  </div>
</template>
<script>
import { gql } from 'graphql-tag'
import Loading from '@/components/Loading.vue'
import commonMixin from '@/mixins/commonMixin.js'
import { network, paginationOptions } from '@/frontend.config.js'

export default {
  components: {
    Loading,
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
          key: 'node_provider_id',
          label: this.$t('pages.cluster.node_provider_id'),
          sortable: true,
          thStyle: { width: '23%' },
        },
        {
          key: 'rewarded',
          label: this.$t('pages.cluster.rewards'),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`,
        },
        {
          key: 'number_of_gets',
          label: this.$t('pages.cluster.gets'),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`,
        },
        {
          key: 'number_of_puts',
          label: this.$t('pages.cluster.puts'),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`,
        },
      ],
      rewardsFields: [
        {
          key: 'provider',
          label: this.$t('pages.cluster.rewarded_provider'),
          sortable: true,
          thStyle: { width: '25%' },
        },
        {
          key: 'block',
          label: this.$t('pages.cluster.block'),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`,
        },
        {
          key: 'event',
          label: this.$t('pages.cluster.event_index'),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`,
        },
        {
          key: 'era',
          label: this.$t('pages.cluster.era'),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`,
        },
        {
          key: 'reward',
          label: this.$t('pages.cluster.reward_amount'),
          sortable: true,
          class: `d-none d-sm-none d-md-table-cell d-lg-table-cell d-xl-table-cell`,
        },
      ],
      providers: [],
      providersNumber: 0,
      clusterId: this.$route.params.id,
      rewards: [],
      providers_rewards: [],
      transferred_bytes: 0,
      clusterStats: [],
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
  watch: {
    $route() {
      this.clusterId = this.$route.params.id
    },
  },
  methods: {
    setPageSize(num) {
      localStorage.paginationOptions = num
      this.perPage = parseInt(num)
    },
    getLastEraStats() {
      if (this.rewards === [] || this.providers === []) {
        return
      }

      this.clusterStats = commonMixin.methods.mergeArraysByProp(
        this.rewards,
        this.providers,
        'node_provider_id'
      )

      this.loading = false
    },
  },
  apollo: {
    $subscribe: {
      stats: {
        query: gql`
          query node_provider_stats($clusterId: String) {
            node_provider_stats(where: { cluster_id: { _eq: $clusterId } }) {
              node_provider_id
            }
          }
        `,
        variables() {
          return {
            clusterId: this.clusterId,
          }
        },
        result({ data }) {
          this.providers = data.node_provider_stats
          this.providersNumber = this.providers.length
          this.getLastEraStats()
          this.loading = false
        },
      },
      rewards: {
        query: gql`
          query events {
            event(where: { method: { _eq: "ProviderRewarded" } }, limit: 20) {
              block_number
              event_index
              data
            }
          }
        `,
        result({ data }) {
          const rewards = data.event.map((record) => {
            return {
              ...record,
              data: JSON.parse(record.data),
            }
          })

          const clusterRewards = rewards.filter((reward) => {
            return reward.data[0] === this.clusterId
          })

          this.rewards = clusterRewards.map((reward) => {
            return {
              clusterId: reward.data[0],
              era: reward.data[1],
              batch_index: reward.data[2],
              stored_bytes: reward.data[3],
              transferred_bytes: reward.data[4],
              number_of_puts: reward.data[5],
              number_of_gets: reward.data[6],
              node_provider_id: reward.data[7],
              rewarded: reward.data[8],
              expected_to_reward: reward.data[9],
              block_number: reward.block_number,
              event_index: reward.event_index,
            }
          })

          this.rewards = commonMixin.methods.filterByUniqueProviderLastEra(
            this.rewards
          )

          this.transferred_bytes = this.rewards.reduce(
            (accumulator, reward) => {
              return accumulator + reward.transferred_bytes
            },
            0
          )

          this.getLastEraStats()
          this.loading = false
        },
      },
    },
  },
}
</script>
