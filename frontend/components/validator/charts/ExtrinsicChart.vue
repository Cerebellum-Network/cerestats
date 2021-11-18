<template>
  <div>
    <div v-if="loading" class="text-center py-4">
      <Loading />
    </div>
    <div v-else>
      <b-button-group size="sm" class="mt-5">
        <button
          type="button"
          class="btn"
          :class="{ active: activeButton === '1m' }"
          @click="month"
        >
          30D
        </button>
        <button
          type="button"
          class="btn"
          :class="{ active: activeButton === '3m' }"
          @click="months"
        >
          3M
        </button>
        <button
          type="button"
          class="btn"
          :class="{ active: activeButton === '1y' }"
          @click="year"
        >
          1Y
        </button>
        <button
          type="button"
          class="btn"
          :class="{ active: activeButton === 'all' }"
          @click="all"
        >
          Max
        </button>
      </b-button-group>
      <LineChart
        id="line"
        :chart-data="chartData"
        :options="chartOptions"
        :height="200"
      />
    </div>
  </div>
</template>
<script>
import { gql } from 'graphql-tag'
import LineChart from '@/components/charts/LineChart.js'
import Loading from '@/components/Loading.vue'

export default {
  components: {
    LineChart,
    Loading,
  },
  data() {
    return {
      loading: true,
      extrinsicsData: null,
      activeButton: '1m',
      limit: 30,
      yearLimit: 12,
      skipMonthQuery: false,
      skipQuery: true,
      chartData: {
        labels: [],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: [],
            backgroundColor: '#BD32A7',
            borderColor: '#BD32A7',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
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
          text: 'Signed extrinsics',
          fontSize: 20,
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
                  day: 'D. MMM',
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
                labelString: 'Number of extrinsics',
              },
            },
          ],
        },
      },
    }
  },
  methods: {
    month() {
      this.chartOptions = {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Signed extrinsics',
          fontSize: 20,
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
                  day: 'D. MMM',
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
                labelString: 'Number of extrinsics',
              },
            },
          ],
        },
      }
      this.$apollo.subscriptions.extrinsicsYearCount.skip = true
      this.$apollo.subscriptions.extrinsicsMonthCount.skip = false
      this.$apollo.subscriptions.extrinsicsMonthCount.refresh()
      this.activeButton = '1m'
      this.limit = 30
    },
    months() {
      this.chartOptions = {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Signed extrinsics',
          fontSize: 20,
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
                  day: 'D. MMM',
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
                labelString: 'Number of extrinsics',
              },
            },
          ],
        },
      }
      this.$apollo.subscriptions.extrinsicsYearCount.skip = true
      this.$apollo.subscriptions.extrinsicsMonthCount.skip = false
      this.$apollo.subscriptions.extrinsicsMonthCount.refresh()
      this.activeButton = '3m'
      this.limit = 90
    },
    year() {
      this.yearLimit = 12
      this.activeButton = '1y'
      this.chartOptions = {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Signed extrinsics',
          fontSize: 20,
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
                  month: "MMM' YY",
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
                labelString: 'Number of extrinsics',
              },
            },
          ],
        },
      }
      this.$apollo.subscriptions.extrinsicsYearCount.skip = false
      this.$apollo.subscriptions.extrinsicsMonthCount.skip = true
      this.$apollo.subscriptions.extrinsicsYearCount.refresh()
    },
    all() {
      this.activeButton = 'all'
      this.yearLimit = 12
      this.chartOptions = {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'Signed extrinsics',
          fontSize: 20,
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
                  month: "MMM' YY",
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
                labelString: 'Number of extrinsics',
              },
            },
          ],
        },
      }
      // this.chartOptions.scales.xAxes[0].time.displayFormats = {
      //   month: "MMM' YY",
      // }
      this.$apollo.subscriptions.extrinsicsYearCount.skip = false
      this.$apollo.subscriptions.extrinsicsMonthCount.skip = true
      this.$apollo.subscriptions.extrinsicsYearCount.refresh()
    },
  },
  apollo: {
    $subscribe: {
      extrinsicsMonthCount: {
        query: gql`
          query MyQuery($limit: Int!) {
            signed_extrinsics_per_day(limit: $limit, order_by: { when: desc }) {
              volume
              when
            }
          }
        `,
        variables() {
          return {
            limit: this.limit,
          }
        },
        skip() {
          return this.skipMonthQuery
        },
        result({ data }) {
          this.extrinsicsData = data.signed_extrinsics_per_day
          const countArray = []
          const labelArray = []
          this.extrinsicsData.forEach((count) => {
            countArray.push(count.volume)
            labelArray.push(count.when)
          })
          const accumulate = (arr) =>
            arr.map(
              (
                (sum) => (value) =>
                  (sum += value)
              )(0)
            )
          const accumulateCount = accumulate(countArray)
          this.chartData = {
            labels: labelArray.reverse(),
            datasets: [
              {
                labels: 'Extrinsics Count',
                data: accumulateCount,
                backgroundColor: '#BD32A7',
                borderColor: '#BD32A7',
                hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
                fill: false,
                showLine: true,
              },
            ],
          }
          this.loading = false
        },
      },
      extrinsicsYearCount: {
        query: gql`
          query MyQuery($limit: Int!) {
            signed_extrinsics_per_month(limit: $limit) {
              volume
              when
            }
          }
        `,
        variables() {
          return {
            limit: this.yearLimit,
          }
        },
        skip() {
          return this.skipQuery
        },
        result({ data }) {
          this.extrinsicsData = data.signed_extrinsics_per_month
          const countArray = []
          const labelArray = []
          this.extrinsicsData.forEach((count) => {
            countArray.push(count.volume)
            labelArray.push(count.when)
          })
          const accumulate = (arr) =>
            arr.map(
              (
                (sum) => (value) =>
                  (sum += value)
              )(0)
            )
          const accumulateCount = accumulate(countArray)
          this.chartData = {
            labels: labelArray,
            datasets: [
              {
                labels: 'Extrinsics Count',
                data: accumulateCount,
                backgroundColor: '#BD32A7',
                borderColor: '#BD32A7',
                hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
                fill: false,
                showLine: true,
              },
            ],
          }
          this.loading = false
        },
      },
    },
  },
}
</script>
<style scoped>
.btn {
  background: none;
  border: solid 1px black;
}
.active {
  border: none !important;
  background-color: #131b32 !important;
  color: white !important;
}
canvas {
  background-color: black;
}

#line {
  background-image: url('../../../static/img/cere-logo-name.png');
  background-repeat: no-repeat;
  background-position: 10% 10%;
  background-size: 200px;
}

@media only screen and (max-width: 600px) {
  #line {
    background-size: 50px;
    background-position: 20% 30%;
  }
}
@media only screen and (min-width: 600px) {
  #line {
    background-size: 70px;
    background-position: 20% 30%;
  }
}

@media only screen and (min-width: 768px) {
  #line {
    background-size: 100px;
    background-position: 14% 20%;
  }
}
@media only screen and (min-width: 992px) {
  #line {
    background-size: 150px;
    background-position: 11% 10%;
  }
}

@media only screen and (min-width: 1200px) {
  #line {
    background-size: 200px;
    background-position: 9% 10%;
  }
}
</style>
