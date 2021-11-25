<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <Loading />
    </div>
    <div v-else>
      <ChartFilter :buttons="filterButtons" :active-button="activeButton" />
      <ReactiveLineChart
        class="canvas-chart"
        :chart-data="chartData"
        :options="chartOptions"
        :height="200"
      />
    </div>
  </div>
</template>
<script>
import ReactiveLineChart from '@/components/charts/ReactiveLineChart.js'
import Loading from '@/components/Loading.vue'
import ChartFilter from '@/components/ChartFilter.vue'
import signedExtrinsic from '@/mixins/signedExtrinsic.js'

export default {
  components: {
    ReactiveLineChart,
    Loading,
    ChartFilter,
  },
  mixins: [signedExtrinsic],
  data() {
    return {
      filterButtons: this.getFilterButtons(),
      loading: true,
      activeButton: '30D',
      chartData: {},
      chartOptions: this.getChartOptions(
        'Cere Signed Extrinsics Cumulative Chart',
        'Extrinsics by Period'
      ),
    }
  },
  mounted() {
    this.month()
  },
  methods: {
    async month() {
      this.activeButton = '30D'
      const queryLimit = 30
      const { count, label } = await this.extrinsicsDayCount(queryLimit)
      const cumulativeCount = await this.cumulativeValue(count)
      const chartData = this.getChartData(label, cumulativeCount)
      this.chartData = chartData
      this.loading = false
    },
    async months() {
      this.activeButton = '3M'
      const queryLimit = 90
      const { count, label } = await this.extrinsicsDayCount(queryLimit)
      const cumulativeCount = await this.cumulativeValue(count)
      const chartData = this.getChartData(label, cumulativeCount)
      this.chartData = chartData
      this.loading = false
    },
    async year() {
      this.activeButton = '1Y'
      const queryLimit = 12
      const { count, label } = await this.extrinsicsMonthCount(queryLimit)
      const cumulativeCount = await this.cumulativeValue(count)
      const chartData = this.getChartData(label, cumulativeCount)
      this.chartData = chartData
      this.loading = false
    },
    async max() {
      this.activeButton = 'Max'
      const queryLimit = 12
      const { count, label } = await this.extrinsicsMonthCount(queryLimit)
      const cumulativeCount = await this.cumulativeValue(count)
      const chartData = this.getChartData(label, cumulativeCount)
      this.chartData = chartData
      this.loading = false
    },
  },
}
</script>
