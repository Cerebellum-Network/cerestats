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
                beginAtZero: true,
                suggestedMin: 0,
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
  // computed: {
  //   chartData() {
  //     return {
  //       labels: [
  //         '2021-08-25',
  //         '2021-08-26',
  //         '2021-08-27',
  //         '2021-08-28',
  //         '2021-08-29',
  //         '2021-08-30',
  //         '2021-08-31',
  //         '2021-09-01',
  //         '2021-09-02',
  //         '2021-09-03',
  //         '2021-09-04',
  //         '2021-09-05',
  //         '2021-09-06',
  //         '2021-09-07',
  //         '2021-09-08',
  //         '2021-09-09',
  //         '2021-09-11',
  //         '2021-09-12',
  //         '2021-09-13',
  //         '2021-09-14',
  //         '2021-09-15',
  //         '2021-09-17',
  //         '2021-09-18',
  //         '2021-09-19',
  //         '2021-09-20',
  //       ],
  //       datasets: [
  //         {
  //           labels: 'Extrinsics Count',
  //           data: [
  //             '37',
  //             '42',
  //             '45',
  //             '63',
  //             '74',
  //             '471',
  //             '547',
  //             '575',
  //             '608',
  //             '675',
  //             '687',
  //             '710',
  //             '754',
  //             '789',
  //             '796',
  //             '797',
  //             '800',
  //             '807',
  //             '846',
  //             '872',
  //             '878',
  //             '890',
  //             '910',
  //             '925',
  //             '951',
  //           ],
  //           backgroundColor: '#B70F93',
  //           borderColor: 'rgba(230, 0, 122, 0.8)',
  //           hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
  //           fill: false,
  //           showLine: true,
  //         },
  //       ],
  //     }
  //     // return {
  //     //   labels: this.extrinsic.map(({ day }) => day),
  //     //   datasets: [
  //     //     {
  //     //       labels: 'Extrinsic',
  //     //       data: this.extrinsic.map(({ count }) => count),
  //     //       backgroundColor: 'rgba(255, 255, 255, 0.8)',
  //     //       borderColor: 'rgba(230, 0, 122, 0.8)',
  //     //       hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
  //     //       fill: false,
  //     //       showLine: true,
  //     //     },
  //     //   ],
  //     // }
  //   },
  // },
  methods: {
    month() {
      this.activeButton = '1m'
      this.limit = 30
    },
    months() {
      this.activeButton = '3m'
      this.limit = 90
    },
    year() {
      this.activeButton = '1y'
      this.chartData = {
        labels: [
          'October',
          'September',
          'August',
          'July',
          'June',
          'May',
          'April',
          'March',
          'February',
          'January',
          'December',
          'November',
        ],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: [
              '100',
              '175',
              '250',
              '360',
              '470',
              '560',
              '630',
              '700',
              '780',
              '890',
              '980',
              '1090',
            ],
            backgroundColor: '#BD32A7',
            borderColor: '#BD32A7',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: false,
            showLine: true,
          },
        ],
      }
    },
    all() {
      this.activeButton = 'all'
      this.chartData = {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021'],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: ['100', '175', '250', '360', '470', '560', '630'],
            backgroundColor: '#BD32A7',
            borderColor: '#BD32A7',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: false,
            showLine: true,
          },
        ],
      }
    },
  },
  apollo: {
    $subscribe: {
      extrinsicsMonthCount: {
        query: gql`
          query MyQuery($limit: Int!) {
            signed_extrinsics_per_day(limit: $limit) {
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
    background-size: 80px;
    background-position: 10% 30%;
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
