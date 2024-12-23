<template>
  <b-navbar toggleable="xl">
    <b-container class="px-sm-3">
      <b-navbar-brand>
        <nuxt-link to="/" class="navbar-brand" title="Reef block explorer">
          <img class="logo" src="/img/cerestats-logo.png" />
          Stats
        </nuxt-link>
      </b-navbar-brand>
      <a
        v-if="network.coinGeckoDenom && USDConversion && USD24hChange"
        :href="`https://www.coingecko.com/en/coins/${network.coinGeckoDenom}`"
        target="_blank"
        class="fiat mh-2"
      >
        <strong>{{ network.tokenSymbol }}</strong> ${{ USDConversion }} ({{
          USD24hChange
        }}%)
      </a>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item right to="/validators">{{
            $t('layout.default.validators')
          }}</b-nav-item>
          <b-nav-item-dropdown text="Blockchain">
            <b-dropdown-item to="/blocks">
              {{ $t('layout.default.blocks') }}
            </b-dropdown-item>
            <b-dropdown-item to="/transfers">
              {{ $t('layout.default.transfers') }}
            </b-dropdown-item>
            <b-dropdown-item to="/extrinsics">
              {{ $t('layout.default.extrinsics') }}
            </b-dropdown-item>
            <b-dropdown-item to="/events">
              {{ $t('layout.default.events') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="DDC">
            <b-dropdown-item :to="`/cluster/${clusterId}`">
              {{ $t('layout.default.dragon_one') }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item right to="/accounts">{{
            $t('layout.default.accounts')
          }}</b-nav-item>
          <b-nav-item right to="/faucet">{{
            $t('layout.default.faucet')
          }}</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-container>
  </b-navbar>
</template>

<script>
import { gql } from 'graphql-tag'
import { network } from '@/frontend.config.js'
export default {
  data() {
    return {
      network,
      // Hardcoded for now
      clusterId: '0x7f82864e4f097e63d04cc279e4d8d2eb45a42ffa',
    }
  },
  computed: {
    USDConversion() {
      return parseFloat(this.$store.state.fiat.usd).toFixed(3)
    },
    USD24hChange() {
      return parseFloat(this.$store.state.fiat.usd_24h_change).toFixed(2)
    },
  },
  created() {
    // Refresh fiat conversion values every minute
    if (this.network.coinGeckoDenom) {
      this.$store.dispatch('fiat/update')
      setInterval(() => {
        this.$store.dispatch('fiat/update')
      }, 60000)
    }
  },
  apollo: {
    $subscribe: {
      cluster: {
        query: gql`
          query cluster {
            cluster(limit: 1) {
              id
            }
          }
        `,
        result({ data }) {
          this.clusterId = data.cluster[0].id
        },
      },
    },
  },
}
</script>
