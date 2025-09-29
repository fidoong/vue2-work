<template>
  <div class="pop-form">
    <el-form :inline="true" :model="form" label-width="100px">
      <el-form-item label="订单ID" disabled>
        <el-input v-model="form.orderId" />
      </el-form-item>
      <el-form-item label="操作类型" disabled>
        <el-input v-model="form.actionType" />
      </el-form-item>
      <el-form-item label="处理结果">
        <el-select v-model="form.result" placeholder="请选择处理结果">
          <el-option label="成功" value="success" />
          <el-option label="失败" value="fail" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" placeholder="请输入处理备注" />
      </el-form-item>
    </el-form>

    <div style="text-align: right; margin-top: 15px;">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" @click="handleConfirm">确认处理</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InnerDialog',
  // 接收外层弹窗传递的参数
  props: {
    orderId: {
      type: String,
      required: true
    },
    actionType: {
      type: String,
      required: true,
      validator: (val) => ['refund', 'cancel', 'modify'].includes(val)
    }
  },
  data() {
    return {
      form: {
        orderId: '', // 外层传的订单ID
        actionType: '', // 外层传的操作类型
        result: 'success', // 处理结果（默认成功）
        remark: '' // 处理备注
      }
    }
  },
  mounted() {
    // 初始化表单（将props赋值给内部数据）
    this.form.orderId = this.orderId
    this.form.actionType = this.actionType
    console.log('内层弹窗接收参数：', { orderId: this.orderId, actionType: this.actionType })
  },
  methods: {
    // 确认处理：回传结果给外层弹窗
    handleConfirm() {
      if (!this.form.result) {
        this.$message.warning('请选择处理结果')
        return
      }

      // 回传数据（包含原始参数+处理结果）
      const resultData = {
        orderId: this.form.orderId,
        actionType: this.form.actionType,
        result: this.form.result,
        remark: this.form.remark,
        handleTime: new Date().toLocaleString()
      }
      this.$emit('ok', resultData)
    },
    // 取消处理
    handleCancel() {
      this.$emit('close', '内层弹窗：用户取消处理')
    }
  }
}
</script>
