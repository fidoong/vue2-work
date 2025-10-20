<template>
  <div class="chart-container">
    <div ref="chartRef" class="chart-dom" :style="{ width: '100%', height: '400px' }" />
  </div>
</template>

<script>
import echartsMixin from '@/components/chart/mixin'

export default {
  mixins: [echartsMixin],
  data() {
    return {
      rawData: null
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.rawData = {}
        // 数据获取后，自己处理成option并更新图表
        const option = this.generateOption(this.rawData)
        this.updateChart(option) // 直接调用mixin的updateChart，传递option
      } catch (err) {
        console.error('数据请求失败：', err)
        this.updateChart(this.generateEmptyOption()) // 空数据处理
      }
    },

    // 组件内部完全掌控option生成（多系列逻辑）
    generateOption(data) {
      const { xData = [], seriesData = [] } = data

      const colors = ['#5070dd', '#b6d634']
      return {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '20%'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['Evaporation', 'Temperature']
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            // prettier-ignore
            data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Evaporation',
            position: 'right',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0]
              }
            },
            axisLabel: {
              formatter: '{value} ml'
            }
          },
          {
            type: 'value',
            name: '温度',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} °C'
            }
          }
        ],
        series: [
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ]
          },
          {
            name: 'Temperature',
            type: 'bar',
            yAxisIndex: 2,
            data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
          }
        ]
      }
    },

    // 空数据时的默认配置（组件自主实现）
    generateEmptyOption() {
      return {
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: []
      }
    }
  }
}
</script>
