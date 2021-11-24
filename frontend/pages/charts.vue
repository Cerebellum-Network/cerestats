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
          <CumulativeSignedExtrinsicsChart />
        </b-col>
        <b-col class="col-xl-12 mb-5">
          <SignedExtrinsicsChart />
        </b-col>
      </b-container>
    </section>
  </div>
</template>

<script>
import CumulativeSignedExtrinsicsChart from '@/components/charts/CumulativeSignedExtrinsicsChart.vue'
import SignedExtrinsicsChart from '@/components/charts/SignedExtrinsicsChart.vue'

export default {
  components: {
    CumulativeSignedExtrinsicsChart,
    SignedExtrinsicsChart,
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
