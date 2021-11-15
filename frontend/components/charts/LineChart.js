import { Line, mixins } from 'vue-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  props: ['data', 'options'],
  mounted() {
    this.addPlugin([zoomPlugin])
    this.renderChart(this.data, this.options)
  },
  watch: {
    chartData() {
      this.$data._chart.update()
    },
  },
}
