<template>
  <div class="detail-field">
    <!-- label与value同一行（flex布局） -->
    <div class="field-row">
      <div class="field-label">{{ field.label }}：</div>
      <div class="field-value">
        <template v-if="typeof field.render === 'function'">
          <render-wrapper :render="field.render" :value="value" :data="data" />
        </template>
        <template v-else-if="field.component">
          <component :is="field.component" :value="value" v-bind="field.props || {}" />
        </template>
        <template v-else>
          <div v-if="Array.isArray(value)" v-html="formatArray(value)" />
          <div v-else-if="isObject(value)">{{ formatObject(value) }}</div>
          <div v-else>{{ value }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import RenderWrapper from './RenderWrapper.vue'

export default {
  name: 'DetailField',
  components: { RenderWrapper },
  props: {
    field: {
      type: Object,
      required: true
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    value() {
      if (!this.field.path) return null
      let val = this.resolvePath(this.data, this.field.path)
      if (this.field.formatter) val = this.field.formatter(val, this.data)
      return val ?? '-'
    }
  },
  methods: {
    isObject(value) {
      return value && typeof value === 'object' && !Array.isArray(value)
    },
    formatArray(array) {
      return array.map(item => {
        if (Array.isArray(item)) return `<div class="nested-array">${this.formatArray(item)}</div>`
        if (this.isObject(item)) return `<span class="obj-item">${this.formatObject(item)}</span>`
        return `<span class="arr-item">${item}</span>`
      }).join('')
    },
    formatObject(obj) {
      return Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join('; ')
    },
    resolvePath(data, path) {
      if (!path) return data
      let current = data
      for (const seg of path.split('.')) {
        if (current == null) break
        current = current[seg]
      }
      return current
    }
  }
}
</script>

<style scoped>
.detail-field {
  width: 100%;
}

/* 关键：label与value同行 */
.field-row {
  display: flex;
  align-items: center;
  line-height: 1.5;
}

/* label样式：固定宽度右对齐 */
.field-label {
  flex: 0 0 100px;
  color: #606266;
  font-weight: 500;
  text-align: right;
  padding-right: 12px;
  box-sizing: border-box;
}

/* value样式：自适应宽度 */
.field-value {
  flex: 1;
  color: #303133;
  word-break: break-all;
}

.arr-item {
  display: inline-block;
  margin: 0 4px 4px 0;
  padding: 2px 6px;
  background: #f5f7fa;
  border-radius: 3px;
}

.obj-item {
  display: inline-block;
  margin: 0 4px 4px 0;
  padding: 2px 6px;
  background: #f0f9eb;
  border-radius: 3px;
  color: #52c41a;
}

.nested-array {
  margin-left: 12px;
  padding-left: 8px;
  border-left: 1px dashed #ddd;
}
</style>
