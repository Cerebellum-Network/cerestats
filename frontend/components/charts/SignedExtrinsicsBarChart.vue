<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <Loading />
    </div>
    <div v-else>
      <ChartFilter :buttons="filterButtons" :active-button="activeButton" />
      <BarChart
        class="canvas-chart"
        :chart-data="chartData"
        :options="chartOptions"
        :height="200"
      />
    </div>
  </div>
</template>
<script>
import BarChart from '@/components/charts/BarChart.js'
import Loading from '@/components/Loading.vue'
import ChartFilter from '@/components/ChartFilter.vue'
import chartMixin from '@/mixins/chartMixin.js'

export default {
  components: {
    BarChart,
    Loading,
    ChartFilter,
  },
  mixins: [chartMixin],
  data() {
    return {
      filterButtons: this.getFilterButtons(),
      loading: true,
      activeButton: '30D',
      chartData: {},
      chartOptions: this.getChartOptions(
        'Cere Signed Extrinsics Chart ',
        'Extrinsics per Period'
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
      const { count, label } = await this.signedExtrinsicDayCount(queryLimit)
      const chartData = this.getChartData(label, count)
      this.chartData = chartData
      this.loading = false
    },
    async months() {
      this.activeButton = '3M'
      const queryLimit = 90
      const { count, label } = await this.signedExtrinsicDayCount(queryLimit)
      const chartData = this.getChartData(label, count)
      this.chartData = chartData
      this.loading = false
    },
    async year() {
      this.activeButton = '1Y'
      const queryLimit = 12
      const { count, label } = await this.signedExtrinsicMonthCount(queryLimit)
      const chartData = this.getChartData(label, count)
      this.chartData = chartData
      this.loading = false
    },
    async max() {
      this.activeButton = 'Max'
      const queryLimit = 12
      const { count, label } = await this.signedExtrinsicMonthCount(queryLimit)
      const chartData = this.getChartData(label, count)
      this.chartData = chartData
      this.loading = false
    },
  },
}
</script>
