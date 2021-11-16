import { Line } from 'vue-chartjs'
// const { reactiveProp } = mixins

export default {
  extends: Line,
  // mixins: [reactiveProp],
  props: ['chartData', 'options'],
  mounted() {
    if (this.$data._chart) {
      this.$data._chart.destroy()
    }
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    chartData() {
      this.$data._chart.update()
    },
    watch: {
      options() {
        console.log('updating')
        this.$data._chart.options = this.options
        this.$data._chart.update()
      },
    },
  },
}
