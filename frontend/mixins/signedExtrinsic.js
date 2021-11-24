import { gql } from 'graphql-tag'
export default {
  methods: {
    async extrinsicsDayCount(queryLimit) {
      const client = this.$apollo.provider.defaultClient
      const query = gql`
        query extrinsicsDayCount {
          signed_extrinsics_per_day_view(
            limit: ${queryLimit}
            order_by: { when: desc }
          ) {
            volume
            when
          }
        }
      `
      const { data } = await client.query({ query })
      const countArray = []
      const labelArray = []
      data.signed_extrinsics_per_day_view.forEach((count) => {
        countArray.push(count.volume)
        labelArray.push(count.when)
      })
      return {
        count: countArray.reverse(),
        label: labelArray.reverse(),
      }
    },
    async extrinsicsMonthCount(queryLimit) {
      const client = this.$apollo.provider.defaultClient
      const query = gql`
        query extrinsicsMonthCount {
          signed_extrinsics_per_month_view(limit: ${queryLimit}) {
            volume
            when
          }
        }
      `
      const { data } = await client.query({ query })
      const countArray = []
      const labelArray = []
      data.signed_extrinsics_per_month_view.forEach((count) => {
        countArray.push(count.volume)
        labelArray.push(count.when)
      })
      return {
        count: countArray,
        label: labelArray,
      }
    },
    cumulativeValue(value) {
      return value.map(
        (
          (sum) => (value) =>
            (sum += value)
        )(0)
      )
    },
  },
}
