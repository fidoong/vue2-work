<template>
  <detail-layout
    :data="orderData"
    :fields="detailFields"
    :columns="5"
  />
</template>

<script>
import DetailLayout from '../../components/DetailPlay/DetailLayout.vue'

// 自定义组件：状态标签
const StatusTag = {
  props: ['value'],
  template: `
    <span :style="{
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      backgroundColor: value === 'success' ? '#e1f3d8' :
                      value === 'pending' ? '#fef3c7' : '#f5f5f5',
      color: value === 'success' ? '#52c41a' :
            value === 'pending' ? '#faad14' : '#606266'
    }">
      {{ value === 'success' ? '已完成' :
      value === 'pending' ? '处理中' : '已取消' }}
    </span>
  `
}

export default {
  components: {
    DetailLayout,
    StatusTag
  },
  data() {
    return {
      // 订单数据源
      orderData: {
        orderNo: 'PAY20231110001',
        createTime: '2023-11-10 14:30:25',
        totalAmount: 7297,
        payType: 'alipay',
        user: {
          name: '张三',
          phone: '13800138000',
          vip: true
        },
        // 商品数组（子字段展示）
        products: [
          {
            id: 101,
            name: '智能手表',
            price: 1299,
            count: 1,
            status: 'success',
            tags: ['新品', '热销']
          },
          {
            id: 102,
            name: '无线充电器',
            price: 199,
            count: 2,
            status: 'pending',
            tags: ['配件']
          },
          {
            id: 103,
            name: '运动手环',
            price: 899,
            count: 3,
            status: 'canceled',
            tags: ['促销']
          }
        ],
        address: {
          province: '江苏省',
          city: '南京市',
          detail: '玄武区中山路100号'
        }
      },

      // 字段配置
      detailFields: [
        // 1. 基础字段
        { label: '订单编号', path: 'orderNo' },
        { label: '创建时间', path: 'createTime' },
        {
          label: '支付方式',
          path: 'payType',
          formatter: (val) => ({ alipay: '支付宝', wechat: '微信' }[val] || val)
        },
        {
          label: '总金额',
          path: 'totalAmount',
          formatter: (val) => `¥${val.toFixed(2)}`
        },

        // 2. 嵌套对象字段
        { label: '用户姓名', path: 'user.name' },
        { label: '联系电话', path: 'user.phone' },
        {
          label: '会员标识',
          path: 'user.vip',
          render: (h, value) => {
            return value
              ? h('span', { style: { color: '#e6a23c' }}, 'VIP会员')
              : h('span', '普通用户')
          }
        },
        {
          label: '收货地址',
          path: 'address',
          formatter: (addr) => `${addr.province}${addr.city}${addr.detail}`
        },

        // 3. 数组字段（显示前缀）
        {
          label: '商品',
          type: 'array',
          path: 'products',
          flatten: true,
          showPrefix: false, // 默认显示前缀（商品1-、商品2-...）
          children: [
            { label: 'ID', path: 'id' },
            { label: '名称', path: 'name' },
            { label: '单价', path: 'price', formatter: (v) => `¥${v}` },
            { label: '数量', path: 'count' },
            {
              label: '小计',
              path: '',
              formatter: (_, item) => item.price * item.count,
              render: (h, val) => h('span', { style: { color: '#1890ff' }}, `¥${val}`)
            }
          ]
        },

        // 4. 数组字段（不显示前缀）
        {
          label: '商品',
          type: 'array',
          path: 'products',
          flatten: true,
          showPrefix: false, // 不显示前缀
          children: [
            { label: '标签', path: 'tags', formatter: (tags) => tags.join('、') },
            { label: '状态', path: 'status', component: StatusTag }
          ]
        }
      ]
    }
  }
}
</script>
