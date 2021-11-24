<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <Loading />
    </div>
    <div v-else>
      <ChartFilter :buttons="filterButtons" :active-button="activeButton" />
      <BarChart
        id="line"
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
import signedExtrinsic from '@/mixins/signedExtrinsic.js'

export default {
  components: {
    BarChart,
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
      const { count, label } = await this.extrinsicsDayCount(queryLimit)
      const chartData = this.getChartData(label, count)
      this.chartData = chartData
      this.loading = false
    },
    async months() {
      this.activeButton = '3M'
      const queryLimit = 90
      const { count, label } = await this.extrinsicsDayCount(queryLimit)
      const chartData = this.getChartData(label, count)
      this.chartData = chartData
      this.loading = false
    },
    async year() {
      this.activeButton = '1Y'
      const queryLimit = 12
      const { count, label } = await this.extrinsicsMonthCount(queryLimit)
      const chartData = this.getChartData(label, count)
      this.chartData = chartData
      this.loading = false
    },
    async max() {
      this.activeButton = 'Max'
      const queryLimit = 12
      const { count, label } = await this.extrinsicsMonthCount(queryLimit)
      const chartData = this.getChartData(label, count)
      this.chartData = chartData
      this.loading = false
    },
  },
}
</script>
<style scoped>
canvas {
  background-color: black;
}

#line {
  background-image: url('../../static/img/cere-charts-watermark.png');
  background-repeat: no-repeat;
  background-position: 22% 30%;
  background-size: 200px;
}

@media only screen and (max-width: 600px) {
  #line {
    background-size: 50px;
  }
}

@media only screen and (min-width: 600px) {
  #line {
    background-size: 70px;
    background-position: 22% 30%;
  }
}

@media only screen and (min-width: 768px) {
  #line {
    background-size: 100px;
    background-position: 14% 25%;
  }
}

@media only screen and (min-width: 992px) {
  #line {
    background-size: 150px;
    background-position: 12% 20%;
  }
}

@media only screen and (min-width: 1200px) {
  #line {
    background-size: 200px;
    background-position: 10% 20%;
  }
}
</style>
