Component({
  properties: {
    title: {
      type: String
    },
    inputPlaceholder: {
      type: String
    },
    activities: {
      type: Array
    },
    actIndex: {
      type: Number
    }
  },
  data: {
    inputData: '',
  },
  methods: {
    onInput(e) {
      this.data.inputData = e.detail.value
      this.triggerEvent('input', e.detail.value, {})
    },
    onConfirm() {
      this.triggerEvent('confirm', this.data.inputData, {})
    },
    onCancel() {
      this.triggerEvent('cancel', {}, {})
    },
    changeActivity(e) {
      let _detail = { value: e.detail.value }
      this.triggerEvent('changeAct', _detail, {})
    }
  }
})
