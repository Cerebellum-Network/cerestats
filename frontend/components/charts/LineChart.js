import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options', 'chartData'],
  mounted() {
    console.log('mounted')
    console.log(this.chartData)
    console.log(this.options)
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    options() {
      console.log(this.chartData)
      console.log(this.options)
      this.renderChart(this.chartData, this.options)
    },
  },
}
