<template>
  <div>
    <section>
      <b-container class="main py-5">
        <b-row class="mb-2">
          <b-col cols="12">
            <h1>{{ $t('pages.charts.title') }}</h1>
          </b-col>
        </b-row>
        <b-col class="col-xl-12 mb-5">
          <CumulativeExtrinsicsChart />
        </b-col>
      </b-container>
    </section>
  </div>
</template>

<script>
import CumulativeExtrinsicsChart from '@/components/validator/charts/CumulativeExtrinsicsChart.vue'

export default {
  components: {
    CumulativeExtrinsicsChart,
  },
  head() {
    return {
      title: this.$t('pages.charts.head_title'),
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Cere Stats',
        },
      ],
    }
  },
}
</script>
