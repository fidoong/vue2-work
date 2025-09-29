import OuterForm from '@/views/components-demo/components/pop/OuterForm.vue'
import InnerForm from '@/views/components-demo/components/pop/InnerForm.vue'
import createPop from '@/utils/pop-helper'

export function createOutFormPop(_this, props = {}, popProps = {}) {
  return createPop({
    parent: _this,
    component: OuterForm,
    props: {
      ...props
    },
    popProps: {
      width: '600px',
      closeOnClickModal: false,
      ...popProps
    }
  })
}

export function createInnerFormPop(_this, props = {}, popProps = {}) {
  return createPop({
    parent: _this,
    component: InnerForm,
    props: {
      ...props
    },
    popProps: {
      width: '700px',
      closeOnClickModal: false,
      ...popProps
    }
  })
}
