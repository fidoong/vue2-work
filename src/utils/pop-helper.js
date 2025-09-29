import Vue from 'vue'
import { Dialog } from 'element-ui'
import 'element-ui/lib/theme-chalk/dialog.css'

// 计数器：记录当前打开的弹窗数量（解决嵌套问题）
let dialogCount = 0
// 最大允许嵌套层数（可根据需求调整）
const MAX_NESTED_LEVEL = 3

/**
 * 函数式弹窗（支持嵌套）
 * @param {Object} opts - 配置项
 * @param {VueComponent} opts.component - 弹窗内容组件
 * @param {VueInstance} opts.parent - 调用者实例（上下文来源 继承$store $router $route i18n 等）
 * @param {Object} [opts.props={}] - 传给内容组件的参数
 * @param {Object} [opts.popProps={}] - Element Dialog 配置
 * @returns {Promise} 交互结果（子组件回传的数据）
 */
export const createPop = (opts) => {
  // 检查是否超过最大嵌套层数
  if (dialogCount >= MAX_NESTED_LEVEL) {
    return Promise.reject(new Error(`弹窗最多允许嵌套 ${MAX_NESTED_LEVEL} 层`))
  }

  // 打开弹窗时计数器+1
  dialogCount++

  return new Promise((resolve, reject) => {
    // 1. 创建弹窗构造器
    const DialogConstructor = Vue.extend({
      parent: opts.parent, // 继承调用者上下文
      render(h) {
        // 解构配置项
        const { component: ContentComp, props: contentProps } = opts
        const popConfig = {
          // Dialog 基础配置（合并默认值和用户配置）
          visible: true,
          title: opts.popProps?.title || '提示',
          width: opts.popProps?.width || '50%',
          closeOnClickModal: opts.popProps?.closeOnClickModal ?? true,
          closeOnPressEscape: opts.popProps?.closeOnPressEscape ?? true,
          transition: 'el-dialog-fade', // 原生动画
          ...opts.popProps
        }

        return h(Dialog, {
          props: popConfig,
          on: {
            // 弹窗原生关闭事件（如点击右上角X）
            close: () => {
              destroy()
              reject(new Error('弹窗已关闭'))
            }
          }
        }, [
          // 嵌入内容组件，传递参数和事件
          h(ContentComp, {
            props: contentProps || {},
            on: {
              // 内容组件确认事件（回传数据）
              ok: (data) => {
                destroy()
                resolve(data)
              },
              // 内容组件取消事件
              close: (reason) => {
                destroy()
                reject(reason || new Error('用户取消操作'))
              }
            }
          })
        ])
      }
    })

    // 2. 实例化弹窗并挂载DOM
    const dialogInstance = new DialogConstructor().$mount()
    document.body.appendChild(dialogInstance.$el)

    // 3. 弹窗销毁函数（清理资源+更新计数器）
    function destroy() {
      dialogCount-- // 关闭时计数器-1
      dialogInstance.$destroy() // 销毁Vue实例
      document.body.removeChild(dialogInstance.$el) // 移除DOM
    }
  })
}

export default createPop
