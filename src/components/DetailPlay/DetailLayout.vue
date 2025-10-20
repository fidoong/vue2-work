<template>
  <div class="detail-layout">
    <div
      v-for="(rowFields, rowIndex) in groupedFlattenFields"
      :key="rowIndex"
      class="layout-row"
    >
      <div
        v-for="(field, colIndex) in rowFields"
        :key="`${rowIndex}-${colIndex}`"
        class="layout-col"
        :style="{ width: `${100 / columns}%` }"
      >
        <detail-field :field="field" :data="getFieldData(field)" />
      </div>
    </div>
  </div>
</template>

<script>
import DetailField from './DetailField.vue'

export default {
  name: 'DetailLayout',
  components: { DetailField },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    fields: {
      type: Array,
      required: true,
      validator: (val) => val.every(item => !!item.label)
    },
    columns: {
      type: Number,
      required: true,
      validator: (v) => v > 0 && Number.isInteger(v)
    },
    parentPrefix: {
      type: String,
      default: ''
    }
  },
  computed: {
    flattenFields() {
      const result = []
      this.fields.forEach(field => {
        if (field.type === 'array' && field.flatten) {
          const items = this.getArrayItems(field)
          items.forEach((item, idx) => {
            // 前缀控制：默认显示，可通过showPrefix=false关闭
            const showPrefix = field.showPrefix !== false
            const itemPrefix = showPrefix ? `${field.label}${idx + 1}-` : ''

            field.children.forEach(childField => {
              result.push({
                ...childField,
                label: `${this.parentPrefix}${itemPrefix}${childField.label}`,
                _arrayIndex: idx,
                _parentField: field
              })
            })
          })
        } else {
          result.push({ ...field, label: `${this.parentPrefix}${field.label}` })
        }
      })
      return result
    },
    groupedFlattenFields() {
      const groups = []
      for (let i = 0; i < this.flattenFields.length; i += this.columns) {
        groups.push(this.flattenFields.slice(i, i + this.columns))
      }
      return groups
    }
  },
  methods: {
    getArrayItems(field) {
      const arr = this.resolvePath(this.data, field.path)
      return Array.isArray(arr) ? arr : []
    },
    getFieldData(field) {
      if (field._arrayIndex !== undefined && field._parentField) {
        const items = this.getArrayItems(field._parentField)
        return items[field._arrayIndex] || {}
      }
      return this.data
    },
    resolvePath(data, path) {
      if (!path || !data) return data
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
.detail-layout {
  width: 100%;
  font-size: 14px;
}

.layout-row {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  border-bottom: 1px solid #f5f5f5;
  &:last-child {
    border-bottom: none;
  }
}

.layout-col {
  box-sizing: border-box;
  padding: 10px 16px;
  border-right: 1px solid #f5f5f5;
}
</style>
