<template>
  <div>
    <section>
      <b-container class="main py-5">
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
              <div class="widget mb-4">
                <div class="col-10">
                  <h5 class="widget-title mb-2">
                    {{ $t('pages.cluster.cluster_id') }}
                  </h5>
                  <h5>
                    {{ clusterId }}
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
                    {{ providers.length }}
                  </h5>
                </div>
              </div>
            </b-col>
            <b-col>
              <div class="widget mb-4">
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
              id="accounts-table"
              striped
              stacked="md"
              :fields="fields"
              :items="clusterStats"
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
                    <h4>{{ shortAddress(data.item.node_provider_id) }}</h4>
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
                <b-table striped hover :fields="rewardsFields" :items="rewards">
                  <template #cell(block)="data">
                    <p class="mb-0">{{ data.item.block_number }}</p>
                  </template>
                  <template #cell(event)="data">
                    <p class="mb-0">
                      {{ data.item.event_index }}
                    </p>
                  </template>
                  <template #cell(provider)="data">
                    <p class="mb-0">
                      {{ data.item.node_provider_id }}
                    </p>
                  </template>
                  <template #cell(reward)="data">
                    <p class="mb-0">
                      {{ data.item.rewarded }}
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
          key: 'node_provider_id',
          label: this.$t('pages.cluster.node_provider_id'),
          sortable: true,
        },
        {
          key: 'node_type',
          label: this.$t('pages.cluster.node_type'),
          sortable: true,
        },
        {
          key: 'rewarded',
          label: this.$t('pages.cluster.rewards'),
          sortable: true,
        },
        {
          key: 'number_of_gets',
          label: this.$t('pages.cluster.gets'),
          sortable: true,
        },
        {
          key: 'number_of_puts',
          label: this.$t('pages.cluster.puts'),
          sortable: true,
        },
      ],
      rewardsFields: [
        {
          key: 'block',
          label: this.$t('pages.cluster.block'),
          sortable: true,
        },
        {
          key: 'event',
          label: this.$t('pages.cluster.event_index'),
          sortable: true,
        },
        {
          key: 'provider',
          label: this.$t('pages.cluster.rewarded_provider'),
          sortable: true,
        },
        {
          key: 'reward',
          label: this.$t('pages.cluster.reward_amount'),
          sortable: true,
        },
      ],
      providers: [],
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
              node_type
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
          this.getLastEraStats()
          this.loading = false
        },
      },
      rewards: {
        query: gql`
          query events {
            event(where: { method: { _eq: "ProviderRewarded" } }) {
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
