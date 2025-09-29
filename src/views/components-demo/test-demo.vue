<template>
  <div style="padding: 30px;">
    <h3>嵌套弹窗演示页面</h3>
    <el-button
      type="primary"
      @click="handlePop"
    >
      打开外层弹窗
    </el-button>

    <!-- 显示最终处理结果 -->
    <div
      v-if="finalResult"
      style="margin-top: 20px; padding: 15px; border: 1px solid #e6a23c; background: #fffbee; border-radius: 4px;"
    >
      <h4>最终处理结果：</h4>
      <pre>{{ finalResult }}</pre>
    </div>
  </div>
</template>

<script>
// 引入外层弹窗组件
import { createOutFormPop } from '@/views/components-demo/components/pop/pop'
export default {
  name: 'NestedDemo',
  data() {
    return {
      // 页面数据：订单列表（将传递给外层弹窗）
      orders: [
        { id: 'OD001', status: 'pending', amount: '¥199' },
        { id: 'OD002', status: 'paid', amount: '¥399' },
        { id: 'OD003', status: 'shipped', amount: '¥299' }
      ],
      // 存储最终结果
      finalResult: null
    }
  },
  methods: {
    handlePop() {
      createOutFormPop(this, {
        orderList: this.orders
      }, {
        title: '订单批量处理--（外层弹窗）',
        width: '600px',
        closeOnClickModal: false
      }).then(result => {
        this.finalResult = result
        this.$message.success('外层弹窗处理完成，结果已同步到页面！')
      }).catch(err => {
        this.$message.info(`外层操作取消：${err.message}`)
      })
    }
  }
}
</script>
