<template>
  <BarChart :data="chartData" :options="chartOptions" :height="200" />
</template>
<script>
import BarChart from '@/components/charts/BarChart.js'
import { network } from '@/frontend.config.js'
export default {
  components: {
    BarChart,
  },
  props: {
    extrinsicCount: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      network,
      chartOptions: {
        responsive: true,
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'extrinsic',
          fontSize: 18,
          fontColor: '#000',
          fontStyle: 'lighter',
        },
        tooltips: {
          backgroundColor: '#000000',
        },
        watermark: {
          image:
            'https://www.google.com/imgres?imgurl=https%3A%2F%2Fmiro.medium.com%2Fmax%2F3150%2F1*VJqmc-GsBhgzwpACZRf_oQ.png&imgrefurl=https%3A%2F%2Fcere-network.medium.com%2Fabout&tbnid=VcPE-S-a2JFnMM&vet=12ahUKEwiDiuP4s5L0AhXisWMGHZZ4Bz4QMygAegUIARDYAQ..i&docid=Rr7C795-95-ssM&w=298&h=298&itg=1&q=cere%20logo&ved=2ahUKEwiDiuP4s5L0AhXisWMGHZZ4Bz4QMygAegUIARDYAQ',
          alignX: 'middle',
          alignY: 'middle',
          position: 'front',
          opacity: 6,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                color: 'rgba(200, 200, 200, 0.4)',
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                suggestedMin: 0,
                suggestedMax: 1,
              },
              gridLines: {
                display: true,
                color: 'rgba(200, 200, 200, 0.4)',
              },
            },
          ],
        },
        zoom: {
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'xy',
          },
        },
      },
    }
  },
  computed: {
    chartData() {
      return {
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
            labels: 'Extrinsic',
            data: [
              '37',
              '5',
              '3',
              '18',
              '11',
              '397',
              '76',
              '28',
              '33',
              '67',
              '12',
              '23',
              '44',
              '35',
              '7',
              '1',
              '3',
              '7',
              '39',
              '26',
              '6',
              '12',
              '15',
              '26',
            ],
            backgroundColor: 'rgba(230, 0, 122, 0.8)',
            borderColor: 'rgba(230, 0, 122, 0.8)',
            hoverBackgroundColor: 'rgba(255, 255, 255, 0.8)',
            fill: true,
            showLine: true,
          },
        ],
      }
    },
  },
}
</script>
