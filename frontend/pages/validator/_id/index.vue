<template>
  <div class="page validator-page container pt-3">
    <div v-if="loading || !validator">
      <Loading />
    </div>
    <div v-else>
      <b-row v-if="network.showValSelectorInPage">
        <b-col offset="9" cols="3">
          <b-dropdown
            id="selected-validators"
            ref="selectedValidators"
            class="selected-validators"
            toggle-class="btn btn-block btn-selected mb-3"
            right
          >
            <template #button-content>
              <span v-if="loading">Selected</span>
              <span v-else>
                {{ selectedValidatorAddresses.length }}/{{
                  network.validatorSetSize
                }}
                selected
              </span>
              <font-awesome-icon icon="star" style="color: #e6dfdf" />
            </template>
            <SelectedValidators />
          </b-dropdown>
        </b-col>
      </b-row>
      <div class="row">
        <div class="col-10">
          <h1 class="mt-3">
            <Identicon :address="accountId" :size="64" />
            <span v-if="validator.name">
              {{ validator.name }}
              <verified-icon v-if="validator.verifiedIdentity" size="lg" />
            </span>
            <span v-else>
              {{ shortAddress(accountId) }}
            </span>
          </h1>
          <h4 v-if="validator.includedThousandValidators">
            <a
              :href="`https://thousand-validators.kusama.network/#/leaderboard/${accountId}`"
              target="_blank"
              class="badge badge-pill badge-info"
              >Thousand Validators Program</a
            >
          </h4>
          <span class="py-2">&nbsp;</span>
        </div>
        <div class="col-2 text-right mt-4">
          <a
            v-b-tooltip.hover
            class="select"
            @click="toggleSelected(validator.stashAddress)"
          >
            <font-awesome-icon
              v-if="isSelected(validator.stashAddress)"
              icon="star"
              style="color: #f1bd23; cursor: pointer"
              class="favorite fa-2x"
              :title="$t('pages.accounts.remove_from_favorites')"
            />
            <font-awesome-icon
              v-else
              icon="star"
              style="color: #e6dfdf; cursor: pointer"
              class="favorite fa-2x"
              :title="$t('pages.accounts.add_to_favorites')"
            />
          </a>
        </div>
      </div>
      <b-card class="mb-4">
        <div v-if="validator.stashAddress" class="row">
          <div class="col-md-3 mb-1">
            <strong>{{ $t('details.validator.stash') }}</strong>
          </div>
          <div class="col-md-9 mb-1 fee">
            <Identicon :address="validator.stashAddress" :size="20" />
            <nuxt-link :to="`/account/${validator.stashAddress}`">
              {{ shortAddress(validator.stashAddress) }}
            </nuxt-link>
          </div>
        </div>
        <div v-if="validator.controllerAddress" class="row">
          <div class="col-md-3 mb-1">
            <strong>{{ $t('details.validator.controller') }}</strong>
          </div>
          <div class="col-md-9 mb-1 fee">
            <Identicon :address="validator.controllerAddress" :size="20" />
            <nuxt-link :to="`/account/${validator.controllerAddress}`">
              {{ shortAddress(validator.controllerAddress) }}
            </nuxt-link>
          </div>
        </div>
        <!-- identity start -->
        <div v-if="validator.identity.email" class="row">
          <div class="col-md-3 mb-2">
            <strong>{{ $t('details.validator.email') }}</strong>
          </div>
          <div class="col-md-9 mb-2 fee">
            <a :href="`mailto:${validator.identity.email}`" target="_blank">
              {{ validator.identity.email }}
            </a>
          </div>
        </div>
        <div v-if="validator.identity.legal" class="row">
          <div class="col-md-3 mb-2">
            <strong>{{ $t('details.validator.legal') }}</strong>
          </div>
          <div class="col-md-9 mb-2 fee">
            {{ validator.identity.legal }}
          </div>
        </div>
        <div v-if="validator.identity.riot" class="row">
          <div class="col-md-3 mb-2">
            <strong>{{ $t('details.validator.riot') }}</strong>
          </div>
          <div class="col-md-9 mb-2 fee">
            <a
              :href="`https://riot.im/app/#/user/${validator.identity.riot}`"
              target="_blank"
            >
              {{ validator.identity.riot }}
            </a>
          </div>
        </div>
        <div v-if="validator.identity.twitter" class="row">
          <div class="col-md-3 mb-2">
            <strong>Twitter</strong>
          </div>
          <div class="col-md-9 mb-2 fee">
            <a
              :href="`https://twitter.com/${validator.identity.twitter}`"
              target="_blank"
            >
              {{ validator.identity.twitter }}
            </a>
          </div>
        </div>
        <div v-if="validator.identity.web" class="row">
          <div class="col-md-3 mb-2">
            <strong>Web</strong>
          </div>
          <div class="col-md-9 mb-2 fee">
            <a :href="validator.identity.web" target="_blank">
              {{ validator.identity.web }}
            </a>
          </div>
        </div>
        <!-- identity end -->
      </b-card>

      <b-tabs content-class="py-4">
        <b-tab title="Metrics" active>
          <b-alert
            show
            dismissible
            variant="info"
            class="text-center py-3 glitch"
          >
            This information is verified and provided by historical data on the
            Cere Network blockchain
          </b-alert>
          <div class="row pt-4">
            <div class="col-md-6 mb-5">
              <Identity
                :identity="validator.identity"
                :rating="validator.identityRating"
              />
            </div>
            <div class="col-md-6 mb-5">
              <Address
                :account-id="validator.stashAddress"
                :identity="validator.identity"
                :rating="validator.addressCreationRating"
                :created-at-block="validator.stashAddressCreationBlock"
                :parent-created-at-block="
                  validator.stashParentAddressCreationBlock
                "
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <Slashes
                :slashes="validator.slashes"
                :rating="validator.slashRating"
              />
            </div>
            <div class="col-md-6 mb-5">
              <Nominators
                :nominators="validator.nominators"
                :rating="validator.nominatorsRating"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6 mb-5">
              <Commission
                :commission="validator.commission"
                :commission-history="validator.commissionHistory"
                :rating="validator.commissionRating"
              />
            </div>
            <div class="col-md-6 mb-5">
              <EraPoints
                :percent="validator.eraPointsPercent"
                :average="eraPointsAveragePercent"
                :era-points-history="validator.eraPointsHistory"
                :rating="validator.eraPointsRating"
              />
            </div>
          </div>
        </b-tab>
        <b-tab title="Charts">
          <div class="row">
            <div class="col-xl-6 pb-4">
              <RelativePerformanceChart
                :relative-performance-history="
                  alignWithHistorySize(validator.relativePerformanceHistory)
                "
              />
            </div>
            <div class="col-xl-6 pb-4">
              <EraPointsChart
                :era-points-history="
                  alignWithHistorySize(validator.eraPointsHistory)
                "
              />
            </div>
          </div>
          <div class="row">
            <div class="col-xl-6 pb-4">
              <PayoutsChart
                :payout-history="alignWithHistorySize(validator.payoutHistory)"
              />
            </div>
            <div class="col-xl-6 pb-4">
              <StakeChart
                :stake-history="alignWithHistorySize(validator.stakeHistory)"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-xl-6 pb-4">
              <CommissionChart
                :commission-history="
                  alignWithHistorySize(validator.commissionHistory)
                "
              />
            </div>
            <div class="col-xl-6 pb-4"></div>
          </div>
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import commonMixin from '@/mixins/commonMixin.js'
import Identity from '@/components/validator/metrics/Identity.vue'
import Address from '@/components/validator/metrics/Address.vue'
import Slashes from '@/components/validator/metrics/Slashes.vue'
import Nominators from '@/components/validator/metrics/Nominators.vue'
import EraPoints from '@/components/validator/metrics/EraPoints.vue'
import Commission from '@/components/validator/metrics/Commission.vue'
import RelativePerformanceChart from '@/components/validator/charts/RelativePerformanceChart.vue'
import EraPointsChart from '@/components/validator/charts/EraPointsChart.vue'
import PayoutsChart from '@/components/validator/charts/PayoutsChart.vue'
import StakeChart from '@/components/validator/charts/StakeChart.vue'
import CommissionChart from '@/components/validator/charts/CommissionChart.vue'
import { network } from '@/frontend.config.js'

export default {
  components: {
    Identity,
    Address,
    Slashes,
    Nominators,
    EraPoints,
    Commission,
    RelativePerformanceChart,
    EraPointsChart,
    PayoutsChart,
    StakeChart,
    CommissionChart,
  },
  mixins: [commonMixin],
  data() {
    return {
      network,
      accountId: this.$route.params.id,
      polling: null,
      validator: null,
      blockHeight: null,
    }
  },
  head() {
    return {
      title: `Cere Stats - Validator`,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: `Validator ${this.accountId} metrics`,
        },
      ],
    }
  },
  computed: {
    loading() {
      return this.$store.state.ranking.loading
    },
    selectedValidatorAddresses() {
      return this.$store.state.ranking.selectedAddresses
    },
    eraPointsAveragePercent() {
      return this.$store.state.ranking.eraPointsAverage
    },
  },
  methods: {
    isSelected(accountId) {
      return this.selectedValidatorAddresses.includes(accountId)
    },
    toggleSelected(accountId) {
      this.$store.dispatch('ranking/toggleSelected', { accountId })
    },
    alignWithHistorySize(data) {
      const start = Math.max(0, data.length - network.historySize)
      return data.slice(start, data.length)
    },
  },
  apollo: {
    $subscribe: {
      validator: {
        query: gql`
          subscription validator($stashAddress: String) {
            ranking(
              where: { stash_address: { _eq: $stashAddress } }
              order_by: { block_height: asc }
              limit: 1
            ) {
              active
              active_eras
              active_in_governance
              active_rating
              address_creation_rating
              cluster_members
              cluster_name
              commission
              commission_history
              commission_rating
              controller_address
              council_backing
              era_points_history
              era_points_percent
              era_points_rating
              governance_rating
              has_sub_identity
              identity
              identity_rating
              included_thousand_validators
              name
              nominators
              nominators_rating
              other_stake
              part_of_cluster
              payout_history
              payout_rating
              performance
              rank
              relative_performance
              relative_performance_history
              self_stake
              stake_history
              slash_rating
              slashed
              slashes
              stash_address
              stash_address_creation_block
              stash_parent_address_creation_block
              sub_accounts_rating
              thousand_validator
              total_rating
              total_stake
              verified_identity
            }
          }
        `,
        variables() {
          return {
            stashAddress: this.accountId,
          }
        },
        skip() {
          return !this.accountId
        },
        result({ data }) {
          const validator = data.ranking[0]
          this.validator = {
            active: validator.active,
            activeEras: validator.active_eras,
            activeInGovernance: validator.active_in_governance,
            activeRating: validator.active_rating,
            addressCreationRating: validator.address_creation_rating,
            clusterMembers: parseInt(validator.cluster_members),
            clusterName: validator.cluster_name,
            commission: parseFloat(validator.commission),
            commissionHistory: JSON.parse(validator.commission_history),
            commissionRating: validator.commission_rating,
            controllerAddress: validator.controller_address,
            councilBacking: validator.council_backing,
            eraPointsHistory: JSON.parse(validator.era_points_history),
            eraPointsPercent: parseFloat(validator.era_points_percent),
            eraPointsRating: validator.era_points_rating,
            governanceRating: validator.governance_rating,
            hasSubIdentity: validator.has_sub_identity,
            identity: JSON.parse(validator.identity),
            identityRating: validator.identity_rating,
            includedThousandValidators: validator.included_thousand_validators,
            name: validator.name,
            nominators: validator.nominators,
            nominatorsRating: validator.nominators_rating,
            otherStake: validator.other_stake,
            partOfCluster: validator.part_of_cluster,
            payoutHistory: JSON.parse(validator.payout_history),
            payoutRating: validator.payout_rating,
            performance: parseFloat(validator.performance),
            rank: validator.rank,
            relativePerformance: parseFloat(validator.relative_performance),
            relativePerformanceHistory: JSON.parse(
              validator.relative_performance_history
            ),
            selfStake: validator.self_stake,
            stakeHistory: JSON.parse(validator.stake_history),
            slashRating: validator.slash_rating,
            slashed: validator.slashed,
            slashes: JSON.parse(validator.slashes),
            stashAddress: validator.stash_address,
            stashAddressCreationBlock: validator.stash_address_creation_block,
            stashParentAddressCreationBlock:
              validator.stash_parent_address_creation_block,
            subAccountsRating: validator.sub_accounts_rating,
            thousandValidator: JSON.parse(validator.thousand_validator),
            totalRating: validator.total_rating,
            totalStake: validator.total_stake,
            verifiedIdentity: validator.verified_identity,
            selected: this.isSelected(validator.stashAddress),
          }
        },
      },
    },
  },
}
</script>
