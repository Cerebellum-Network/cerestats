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
      filterButtons: [
        {
          name: '30D',
          method: this.month,
        },
        {
          name: '3M',
          method: this.months,
        },
        {
          name: '1Y',
          method: this.year,
        },
        {
          name: 'Max',
          method: this.max,
        },
      ],
      loading: true,
      activeButton: '30D',
      chartData: {
        labels: [],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: [],
            backgroundColor: '#BD32A7',
            borderColor: '#BD32A7',
            hoverBackgroundColor: '#BD32A7',
            fill: false,
            showLine: true,
          },
        ],
      },
      chartOptions: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Cere Signed Extrinsics Chart ',
          fontSize: 20,
          position: 'top',
          fontColor: '#000',
          fontStyle: 'bold',
          lineHeight: 2,
        },
        tooltips: {
          backgroundColor: '#000000',
        },
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
                displayFormats: {
                  week: 'D. MMM',
                  day: 'D. MMM',
                  month: "MMM 'YY",
                },
              },
              distribution: 'series',
              gridLines: {
                display: true,
                color: 'rgba(200, 200, 200, 0.4)',
              },
              ticks: {
                fontSize: 12,
                padding: 10,
              },
              scaleLabel: {
                display: false,
                labelString: 'Date',
                padding: 10,
                fontSize: 12,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                suggestedMin: 0,
                steps: 10,
                fontSize: 12,
                padding: 10,
              },
              gridLines: {
                display: true,
                color: 'rgba(200, 200, 200, 0.4)',
              },
              scaleLabel: {
                display: true,
                labelString: 'Extrinsics per Period',
              },
            },
          ],
        },
        animation: {
          duration: 300,
        },
      },
    }
  },
  mounted() {
    this.month()
  },
  methods: {
    async month() {
      this.activeButton = '30D'
      const { count, label } = await this.extrinsicsDayCount(30)
      this.chartData = {
        labels: label,
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: count,
            backgroundColor: '#BD32A7',
            borderColor: '#BD32A7',
            hoverBackgroundColor: '#BD32A7',
            fill: false,
            showLine: true,
          },
        ],
      }
      this.loading = false
    },
    async months() {
      this.activeButton = '3M'
      const { count, label } = await this.extrinsicsDayCount(90)
      this.chartData = {
        labels: label,
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: count,
            backgroundColor: '#BD32A7',
            borderColor: '#BD32A7',
            hoverBackgroundColor: '#BD32A7',
            fill: false,
            showLine: true,
          },
        ],
      }
      this.loading = false
    },
    async year() {
      this.activeButton = '1Y'
      const { count, label } = await this.extrinsicsMonthCount(12)
      this.chartData = {
        labels: label,
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: count,
            backgroundColor: '#BD32A7',
            borderColor: '#BD32A7',
            hoverBackgroundColor: '#BD32A7',
            fill: false,
            showLine: true,
          },
        ],
      }
      this.loading = false
    },
    async max() {
      this.activeButton = 'Max'
      const { count, label } = await this.extrinsicsMonthCount(12)
      this.chartData = {
        labels: label,
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: count,
            backgroundColor: '#BD32A7',
            borderColor: '#BD32A7',
            hoverBackgroundColor: '#BD32A7',
            fill: false,
            showLine: true,
          },
        ],
      }
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
