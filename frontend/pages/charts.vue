<template>
  <div>
    <section>
      <b-container class="main py-5">
        <b-row class="mb-2">
          <b-col cols="12">
            <h1>{{ $t('pages.chart.title') }}</h1>
          </b-col>
        </b-row>
        <b-col class="col-xl-12 mb-5">
          <ExtrinsicChart />
        </b-col>
        <!-- <b-col class="mb-5">
          <ExtrinsicDayChart />
        </b-col> -->
      </b-container>
    </section>
  </div>
</template>

<script>
import ExtrinsicChart from '@/components/validator/charts/ExtrinsicChart.vue'
// import ExtrinsicDayChart from '@/components/validator/charts/ExtrinsicDayChart.vue'

export default {
  components: {
    ExtrinsicChart,
    // ExtrinsicDayChart,
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
}
</script>
