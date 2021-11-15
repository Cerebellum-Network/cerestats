<template>
  <div>
    <b-button-group size="sm" class="mt-5">
      <button
        type="button"
        class="btn btn-outline-light"
        :class="{ active: activeButton === 'btn1' }"
        @click="days"
      >
        Last 7 days
      </button>
      <button
        type="button"
        class="btn btn-outline-light"
        :class="{ active: activeButton === 'btn2' }"
        @click="month"
      >
        Month
      </button>
      <button
        type="button"
        class="btn btn-outline-light"
        :class="{ active: activeButton === 'btn3' }"
        @click="year"
      >
        Year
      </button>
    </b-button-group>
    <LineChart :chart-data="chartData" :options="chartOptions" :height="200" />
  </div>
</template>
<script>
import LineChart from '@/components/charts/LineChart.js'

export default {
  components: {
    LineChart,
  },
  props: {
    extrinsic: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      activeButton: 'btn1',
      chartData: {
        labels: [
          '2021-08-25',
          '2021-08-26',
          '2021-08-27',
          '2021-08-28',
          '2021-08-29',
          '2021-08-30',
          '2021-08-31',
          '2021-09-01',
          '2021-09-02',
          '2021-09-03',
          '2021-09-04',
          '2021-09-05',
          '2021-09-06',
          '2021-09-07',
          '2021-09-08',
          '2021-09-09',
          '2021-09-11',
          '2021-09-12',
          '2021-09-13',
          '2021-09-14',
          '2021-09-15',
          '2021-09-17',
          '2021-09-18',
          '2021-09-19',
          '2021-09-20',
        ],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: [
              '37',
              '42',
              '45',
              '63',
              '74',
              '471',
              '547',
              '575',
              '608',
              '675',
              '687',
              '710',
              '754',
              '789',
              '796',
              '797',
              '800',
              '807',
              '846',
              '872',
              '878',
              '890',
              '910',
              '925',
              '951',
            ],
            backgroundColor: '#B70F93',
            borderColor: 'rgba(230, 0, 122, 0.8)',
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
                display: true,
                labelString: 'Time',
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
                labelString: 'Number of Extrinsics',
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
    days() {
      this.activeButton = 'btn1'
      console.log(this.activeButton)
      this.chartData = {
        labels: [
          '2021-08-25',
          '2021-08-26',
          '2021-08-27',
          '2021-08-28',
          '2021-08-29',
          '2021-08-30',
          '2021-08-31',
          '2021-09-01',
          '2021-09-02',
          '2021-09-03',
          '2021-09-04',
          '2021-09-05',
          '2021-09-06',
          '2021-09-07',
          '2021-09-08',
          '2021-09-09',
          '2021-09-11',
          '2021-09-12',
          '2021-09-13',
          '2021-09-14',
          '2021-09-15',
          '2021-09-17',
          '2021-09-18',
          '2021-09-19',
          '2021-09-20',
        ],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: [
              '37',
              '42',
              '45',
              '63',
              '74',
              '471',
              '547',
              '575',
              '608',
              '675',
              '687',
              '710',
              '754',
              '789',
              '796',
              '797',
              '800',
              '807',
              '846',
              '872',
              '878',
              '890',
              '910',
              '925',
              '951',
            ],
            backgroundColor: '#B70F93',
            borderColor: 'rgba(230, 0, 122, 0.8)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: false,
            showLine: true,
          },
        ],
      }
    },
    month() {
      this.activeButton = 'btn2'
      this.chartData = {
        labels: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
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
            backgroundColor: '#B70F93',
            borderColor: 'rgba(230, 0, 122, 0.8)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: false,
            showLine: true,
          },
        ],
      }
    },
    year() {
      this.activeButton = 'btn3'
      this.chartData = {
        labels: ['2015', '2016', '2017', '2018', '2019', '2020', '2021'],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: ['100', '175', '250', '360', '470', '560', '630'],
            backgroundColor: '#B70F93',
            borderColor: 'rgba(230, 0, 122, 0.8)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: false,
            showLine: true,
          },
        ],
      }
    },
  },
}
</script>
<style>
.btn {
  background: none;
}
.active {
  background-color: #b70f93 !important;
  color: white !important;
}
</style>
