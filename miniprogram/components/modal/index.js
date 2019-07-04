Component({      /*组件*/
  properties: {          /*配置文件*/
    title: {
      type: String
    },
    inputPlaceholder: {        /*使用placeholder对需要提示的文本框设置提示信息*/
      type: String
    },
  
  },
  data: {
    inputData: '',
  },
  methods: {
    onInput(e) {          /*事件在用户输入时触发*/
      this.data.inputData = e.detail.value
      this.triggerEvent('input', e.detail.value, {})
    },
    onConfirm() {    /*操作确认*/
      this.triggerEvent('confirm', this.data.inputData, {})
    },
    onCancel() {     /*操作取消*/
      this.triggerEvent('cancel', {}, {})
    },
  }
})
