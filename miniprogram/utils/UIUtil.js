function showToast(title, isSuccess) {      /*微信小程序的提示框*/
  isSuccess = isSuccess ? 'success' : 'none'
  wx.showToast({
    title,
    icon: isSuccess,     /*图标*/
    duration: 2000    /*显示时长*/
  })
}

function showModal(title, content, onConfirm, onCancel) {
  wx.showModal({
    title: title,      /*删除目标*/
    content: content,    /*确认要删除？*/
    success(res) {
      if (res.confirm) {
        onConfirm()       /*点击确定*/
      } else if (res.cancel) {
        if (onCancel) onCancel()    /*点击取消，默认隐藏弹框*/
      }
    }
  })
}

export { showToast, showModal }
