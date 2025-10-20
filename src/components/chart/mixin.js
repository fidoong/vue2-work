import echarts from 'echarts'
import { debounce } from 'lodash-es'

export default {
  data() {
    return {
      chartInstance: null,
      chartLoading: false
    }
  },
  methods: {
    // 初始化图表（仅负责创建实例和监听事件）
    initChart() {
      if (this.chartInstance) return
      const chartDom = this.$refs.chartRef
      if (!chartDom) return console.error('图表容器不存在')

      this.chartInstance = echarts.init(chartDom)
      this.handleResize = debounce(() => {
        this.chartInstance?.resize()
      }, 100)
      window.addEventListener('resize', this.handleResize)
    },

    // 接收组件传递的option，直接更新图表（核心优化点）
    updateChart(option) {
      if (!this.chartInstance) return
      this.chartLoading = true
      this.chartInstance.showLoading()

      try {
        // 直接使用组件传递的option，不再依赖getChartOption
        this.chartInstance.setOption(option, true)
      } catch (err) {
        console.error('图表配置错误：', err)
      } finally {
        this.chartInstance.hideLoading()
        this.chartLoading = false
      }
    },

    // 销毁实例（保持不变）
    destroyChart() {
      if (this.chartInstance) {
        this.chartInstance.dispose()
        this.chartInstance = null
      }
      window.removeEventListener('resize', this.handleResize)
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    this.destroyChart()
  }
}
