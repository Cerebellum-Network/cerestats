import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    this.renderChart(this.chartData, this.options)
  },
  watch: {
    options() {
      this.$data._chart.options = this.options
      this.$data._chart.update()
    },
  },
}
