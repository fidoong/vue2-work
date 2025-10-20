<script>
/**
 * 用于处理render函数的包装组件
 * 接收h函数、值、数据并执行render逻辑
 */
export default {
  props: {
    render: {
      type: Function,
      required: true
    },
    value: {
      type: [String, Number, Boolean, Array, Object, null],
      default: null
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  render(h) {
    // 调用传入的render函数，传递h、value、data参数
    return this.render(h, this.value, this.data)
  }
}
</script>
