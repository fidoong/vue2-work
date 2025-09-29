<template>
  <div style="padding: 20px;">
    <p>外层弹窗（选择订单并处理）</p>
    <el-table
      :data="orderList"
      border
      size="small"
      :row-key="row => row.id"
      :highlight-current-row="true"
      style="margin-bottom: 15px;"
      @row-click="handleRowClick"
    >
      <el-table-column prop="id" label="订单ID" width="180" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="amount" label="金额" width="100" />
    </el-table>

    <el-form :model="formModel" inline size="small">
      <el-form-item label="操作类型：">
        <el-select v-model="formModel.actionType" placeholder="请选择">
          <el-option label="退款" value="refund" />
          <el-option label="取消订单" value="cancel" />
          <el-option label="修改信息" value="modify" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="openInnerDialog"
        >
          执行操作（打开内层弹窗）
        </el-button>
      </el-form-item>
      <div style="text-align: right; margin-top: 15px;">
        <el-button size="small" @click="handleCancel">取消</el-button>
        <el-button size="small" type="primary" @click="handleConfirm">确认提交给页面</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
// 引入内层弹窗组件
import { createInnerFormPop } from '@/views/components-demo/components/pop/pop'
export default {
  name: 'OuterDialog',
  // 接收页面传递的参数（订单列表）
  props: {
    orderList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      formModel: {
        selectedOrderId: '', // 选中的订单ID
        actionType: '', // 选择的操作类型
        innerResult: null // 存储内层弹窗回传的结果
      }
    }
  },
  methods: {
    // 选择表格行（记录选中的订单ID）
    handleRowClick(row) {
      this.formModel.selectedOrderId = row.id
      console.log('store', this.$store)
    },

    openInnerDialog() {
      createInnerFormPop(this, {
        orderId: this.formModel.selectedOrderId,
        actionType: this.formModel.actionType
      }, {
        title: `处理订单 ${this.formModel.selectedOrderId}`
      }).then(innerResult => {
        this.formModel.innerResult = innerResult
        this.$message.success('内层弹窗处理完成！')
        console.log('外层弹窗接收内层回传：', innerResult)
      }).catch(error => {
        this.$message.info(`内层操作取消：${error.message}`)
      })
    },

    // 确认提交：将结果回传给页面
    handleConfirm() {
      if (!this.formModel.innerResult) {
        this.$message.warning('请先通过内层弹窗完成处理')
        return
      }

      // 回传数据给页面（包含内层结果+外层信息）
      const resultData = {
        ...this.formModel.innerResult,
        operator: this.$store.state.user.name || 'admin', // 演示：使用继承的$store
        outerRemark: '外层弹窗确认通过'
      }
      this.$emit('ok', resultData)
    },

    // 取消操作
    handleCancel() {
      this.$emit('close', '外层弹窗：用户取消操作')
    }
  }
}
</script>
