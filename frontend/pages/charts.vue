<template>
  <div>
    <section>
      <b-container class="main py-5">
        <b-row class="mb-2">
          <b-col cols="12">
            <h1>{{ $t('pages.chart.title') }}</h1>
          </b-col>
        </b-row>
        <b-col class="mb-5">
          <ExtrinsicChart :extrinsic="dataToShow" />
        </b-col>
        <b-col class="mb-5">
          <ExtrinsicDayChart />
        </b-col>
      </b-container>
    </section>
  </div>
</template>

<script>
import { gql } from 'graphql-tag'
import ExtrinsicChart from '@/components/validator/charts/ExtrinsicChart.vue'
import ExtrinsicDayChart from '@/components/validator/charts/ExtrinsicDayChart.vue'

export default {
  components: {
    ExtrinsicChart,
    ExtrinsicDayChart,
  },
  data() {
    return {
      dataToShow: [],
    }
  },
  head() {
    return {
      title: this.$t('pages.chart.head_title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Cere Stats',
        },
      ],
    }
  },
  apollo: {
    $subscribe: {
      banner: {
        query: gql`
          query count {
            extrinsic_count(limit: 30) {
              count
              day
            }
          }
        `,
        result({ data }) {
          data.extrinsic_count.forEach((element) => {
            this.dataToShow.push({ count: element.count, day: element.day })
          })
        },
      },
    },
  },
}
</script>
