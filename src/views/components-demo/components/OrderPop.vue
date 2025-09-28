<template>
  <el-dialog
    class="base-dialog"
    :title="title"
    :visible="visible"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="formModel"
      :rules="rules"
      :inline="true"
      label-width="120px"
    >
      <el-form-item
        label="活动名称"
        prop="name"
      >
        <el-input
          v-model="formModel.name"
        />
      </el-form-item>
      <el-form-item label="活动区域" prop="region">
        <el-select
          v-model="formModel.region"
          placeholder="请选择活动区域"
        >
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间" required>
        <el-form-item prop="date1">
          <el-date-picker
            v-model="formModel.date1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
      </el-form-item>
      <div class="fill-row create-bj">
        <h4>新增表具</h4>
        <i
          class="el-icon-circle-plus-outline"
          @click="handleCreateDynForm"
        />
      </div>
      <div
        v-for="(item, i) in formModel.dynModel"
        :key="i"
        class="dyn-form-item"
      >
        <el-form-item
          :rules="rules.name"
          label="活动名称"
          :prop="'dynModel.' + i + '.name'"
        >
          <el-input v-model="item.name" />
        </el-form-item>
        <el-form-item
          :rules="rules.region"
          label="活动地区"
          :prop="'dynModel.' + i + '.region'"
        >
          <el-input v-model="item.region" />
        </el-form-item>
        <i
          v-if="formModel.dynModel.length>1 && i === formModel.dynModel.length-1"
          class="el-icon-remove-outline"
          style="margin-top: 12px"
          @click="handleDeleteDynForm(i)"
        />
      </div>
      <el-form-item label="即时配送" prop="delivery">
        <el-switch v-model="formModel.delivery" />
      </el-form-item>
      <el-form-item
        label="活动性质"
        prop="type"
      >
        <el-checkbox-group v-model="formModel.type">
          <el-checkbox label="美食/餐厅线上活动" name="type" />
          <el-checkbox label="地推活动" name="type" />
          <el-checkbox label="线下主题活动" name="type" />
          <el-checkbox label="单纯品牌曝光" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="特殊资源"
        prop="resource"
      >
        <el-radio-group v-model="formModel.resource">
          <el-radio label="线上品牌商赞助" />
          <el-radio label="线下场地免费" />
        </el-radio-group>
      </el-form-item>
      <el-form-item
        class="fill-row"
        label="活动形式"
        prop="desc"
      >
        <el-input v-model="formModel.desc" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" :disabled="loading" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    rowData: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:visible', 'refresh'],
  data() {
    return {
      loading: false,
      formModel: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        dynModel: [{
          region: '',
          name: ''
        }],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isEdit() {
      return Boolean(this.id)
    },
    title() {
      return this.id ? '编辑订单' : '新增订单'
    }
  },
  methods: {

    handleCreateDynForm() {
      this.formModel.dynModel.push({
        region: '',
        name: ''
      })
    },
    handleDeleteDynForm(i) {
      if (i) {
        this.formModel.dynModel.splice(i, 1)
      } else {
        this.$message('请保留至少一个表具')
      }
    },
    // 新增编辑
    handleCreateOrUpdate() {
      const add = (params) => {
        return Promise.resolve(params)
      }
      const api = this.isEdit ? add : add
      this.loading = true
      api({
        ...this.formModel
      }).then(() => {
        this.$emit('update:visible', false)
        this.resetForm()
        this.$emit('refresh')
        this.loading = false
      }).catch(() => {
        this.$message(`${this.isEdit ? '编辑失败' : '新增失败'}`)
      }).finally(() => {
        this.loading = false
      })
    },
    // 校验
    validateForm() {
      return new Promise((resolve, reject) => {
        this.$refs?.formRef?.validate((valid) => {
          if (valid) {
            resolve()
          } else {
            reject(new Error('校验失败'))
          }
        })
      })
    },
    // 取消
    handleClose() {
      this.$emit('update:visible', false)
    },
    // 提交
    handleSubmit() {
      console.log('formModel', this.formModel)
      this.validateForm().then(async() => {
        await this.handleCreateOrUpdate()
      }).catch((err) => {
        console.error(err)
        return false
      }).finally(() => {
        this.loading = false
      })
    },

    // 重置
    resetForm() {
      this.$refs?.formRef?.resetFields()
    }
  }
}
</script>

<style scoped lang="scss">
.create-bj {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
