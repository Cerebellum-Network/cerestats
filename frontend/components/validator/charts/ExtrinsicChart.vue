<template>
  <div>
    <b-button-group size="sm" class="mt-5">
      <button
        type="button"
        class="btn"
        :class="{ active: activeButton === '1m' }"
        @click="month"
      >
        1M
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
        ALL
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
      activeButton: '1m',
      chartData: {
        labels: [
          '2021-10-17',
          '2021-10-18',
          '2021-10-19',
          '2021-10-21',
          '2021-10-22',
          '2021-10-23',
          '2021-10-24',
          '2021-10-25',
          '2021-10-26',
          '2021-10-27',
          '2021-10-28',
          '2021-10-29',
          '2021-10-30',
          '2021-10-31',
          '2021-11-01',
          '2021-11-02',
          '2021-11-03',
          '2021-11-04',
          '2021-11-05',
          '2021-11-06',
          '2021-11-07',
          '2021-11-08',
          '2021-11-09',
          '2021-11-10',
          '2021-11-11',
          '2021-11-12',
          '2021-11-13',
          '2021-11-14',
          '2021-11-15',
        ],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: [
              '181',
              '346',
              '421',
              '561',
              '607',
              '732',
              '880',
              '944',
              '1037',
              '1165',
              '1274',
              '1395',
              '1490',
              '1558',
              '1627',
              '1724',
              '1877',
              '1950',
              '2021',
              '2150',
              '2246',
              '2371',
              '2438',
              '2556',
              '2698',
              '2717',
              '2825',
              '2947',
              '3064',
              '3178',
            ],
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
      this.chartData = {
        labels: [
          '2021-10-17',
          '2021-10-18',
          '2021-10-19',
          '2021-10-21',
          '2021-10-22',
          '2021-10-23',
          '2021-10-24',
          '2021-10-25',
          '2021-10-26',
          '2021-10-27',
          '2021-10-28',
          '2021-10-29',
          '2021-10-30',
          '2021-10-31',
          '2021-11-01',
          '2021-11-02',
          '2021-11-03',
          '2021-11-04',
          '2021-11-05',
          '2021-11-06',
          '2021-11-07',
          '2021-11-08',
          '2021-11-09',
          '2021-11-10',
          '2021-11-11',
          '2021-11-12',
          '2021-11-13',
          '2021-11-14',
          '2021-11-15',
        ],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: [
              '181',
              '346',
              '421',
              '561',
              '607',
              '732',
              '880',
              '944',
              '1037',
              '1165',
              '1274',
              '1395',
              '1490',
              '1558',
              '1627',
              '1724',
              '1877',
              '1950',
              '2021',
              '2150',
              '2246',
              '2371',
              '2438',
              '2556',
              '2698',
              '2717',
              '2825',
              '2947',
              '3064',
              '3178',
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
    months() {
      this.activeButton = '3m'
      this.chartData = {
        labels: [
          '2021-09-18',
          '2021-09-19',
          '2021-09-20',
          '2021-09-21',
          '2021-09-22',
          '2021-09-23',
          '2021-09-24',
          '2021-09-25',
          '2021-09-26',
          '2021-09-27',
          '2021-09-28',
          '2021-09-29',
          '2021-09-30',
          '2021-10-01',
          '2021-10-02',
          '2021-10-03',
          '2021-10-04',
          '2021-10-05',
          '2021-10-06',
          '2021-10-07',
          '2021-10-08',
          '2021-10-09',
          '2021-10-10',
          '2021-10-11',
          '2021-10-12',
          '2021-10-13',
          '2021-10-14',
          '2021-10-15',
          '2021-10-16',
          '2021-10-17',
          '2021-10-18',
          '2021-10-19',
          '2021-10-20',
          '2021-10-21',
          '2021-10-22',
          '2021-10-23',
          '2021-10-24',
          '2021-10-25',
          '2021-10-26',
          '2021-10-27',
          '2021-10-28',
          '2021-10-29',
          '2021-10-30',
          '2021-10-31',
          '2021-11-01',
          '2021-11-02',
          '2021-11-03',
          '2021-11-04',
          '2021-11-05',
          '2021-11-06',
          '2021-11-07',
          '2021-11-08',
          '2021-11-09',
          '2021-11-10',
          '2021-11-11',
          '2021-11-12',
          '2021-11-13',
          '2021-11-14',
          '2021-11-15',
          '2021-11-16',
          '2021-11-17',
          '2021-11-18',
          '2021-11-19',
          '2021-11-20',
          '2021-11-21',
          '2021-11-22',
          '2021-11-23',
          '2021-11-24',
          '2021-11-25',
          '2021-11-26',
          '2021-11-27',
          '2021-11-28',
          '2021-11-29',
          '2021-11-30',
          '2021-12-01',
          '2021-12-02',
          '2021-12-03',
          '2021-12-04',
          '2021-12-05',
          '2021-12-06',
          '2021-12-07',
          '2021-12-08',
          '2021-12-09',
          '2021-12-10',
          '2021-12-11',
          '2021-12-12',
          '2021-12-13',
          '2021-12-14',
          '2021-12-15',
          '2021-12-16',
        ],
        datasets: [
          {
            labels: 'Extrinsics Count',
            data: [
              '728',
              '310',
              '114',
              '927',
              '455',
              '868',
              '602',
              '171',
              '184',
              '842',
              '956',
              '982',
              '883',
              '786',
              '79',
              '645',
              '451',
              '975',
              '435',
              '790',
              '840',
              '591',
              '615',
              '816',
              '928',
              '632',
              '698',
              '870',
              '560',
              '114',
              '210',
              '225',
              '534',
              '854',
              '354',
              '853',
              '722',
              '768',
              '625',
              '512',
              '619',
              '66',
              '763',
              '690',
              '819',
              '63',
              '772',
              '54',
              '297',
              '812',
              '330',
              '874',
              '488',
              '779',
              '447',
              '871',
              '653',
              '206',
              '948',
              '656',
              '278',
              '601',
              '387',
              '664',
              '491',
              '954',
              '42',
              '156',
              '14',
              '724',
              '915',
              '614',
              '394',
              '192',
              '869',
              '595',
              '646',
              '320',
              '400',
              '412',
              '127',
              '714',
              '488',
              '889',
              '465',
              '943',
              '486',
              '789',
              '108',
              '798',
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
</style>
