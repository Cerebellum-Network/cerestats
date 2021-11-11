import { Line } from 'vue-chartjs'
export default {
  extends: Line,
  props: ['data', 'options'],
  mounted() {
    // this.renderChart(this.data, this.options)
    this.renderLineChart()
  },
  methods: {
    renderLineChart() {
      this.renderChart(this.data, this.options)
    },
  },
  watch: {
    data() {
      // this._chart.destroy()
      this.renderLineChart()
    },
  },
}
