import { DetailModel } from '../../models/detail'
import { showToast, showModal } from '../../utils/UIUtil'

const globalEnv = getApp()       /*定义全局事件流*/

Page({    /*页面*/
  data: {   /*数据*/
    goalId: '',
    goalTitle: '',
    lastUpdate: '',
    time: '',
    longestTime: '',    /*最长记录时间*/
    goalRecords: null,
    editingGoal: false,       /*编辑目标*/
    uploadingGoalTitle: false    /*上传目标标题*/
  },

  onLoad: function (options) {          /*上传*/
    this.data.goalId = options.id
  },

  onShow() {    /*监视判断是否进入显示页面*/
    this.getGoalData(this.data.goalId)
  },

  onStartRecord() {    /*开始记录*/
    let timerInfo = globalEnv.checkExistTimer()

    if (timerInfo.goalId !== '' && timerInfo.goalId !== this.data.goalId) {       /*判断是否有目标时间正在记录*/
      showToast('你目前已经有目标在进行中')
    } else {
      wx.navigateTo({     /*小程序页面跳转*/
        url:
          '/pages/timer/index?id=' +
          this.data.goalId +
          '&title=' +
          encodeURIComponent(this.data.goalTitle)    /*把字符串作为URI组件进行编码*/
      })
    }
  },

  onEditGoalTitle() {   /*编辑目标名称*/
    this.setData({
      editingGoal: true
    })
  },

  onEditCompleted(e) {   /*编辑完成*/
    if (!e.detail.length) {
      showToast('标题不能为空')
      return
    }

    if (this.data.uploadingGoalTitle) return

    this.data.uploadingGoalTitle = true   /*上传目标名称成功*/

    DetailModel.editGoalTitle(this.data.goalId, e.detail)  /*修改目标名称*/
      .then(res => {
        this.setData({
          editingGoal: false
        })
        this.data.uploadingGoalTitle = false
        showToast('修改成功', true)
      })
      .catch(err => {
        this.setData({
          editingGoal: false
        })
        this.data.uploadingGoalTitle = false
        showToast('修改失败')
      })
  },

  onEditCancel() {  /*取消编辑*/
    this.setData({
      editingGoal: false
    })
  },

  onRemoveGoal() {   /*删除目标*/
    showModal('', '是否删除“' + this.data.goalTitle + '”', () => {
      DetailModel.removeGoal(this.data.goalId).then(  /*确定是否删除*/
        res => {
          wx.navigateBack({
            delta: 1
          })
        },
        err => {
          showToast('删除失败')
        }
      )
    })
  },

  getGoalData(id) {        /*获取目标数据*/
    DetailModel.getGoalData(id).then(
      res => {
        let data = DetailModel.formatGoalData(res.result)
        this.setData({
          goalTitle: data.title,
          lastUpdate: data.lastUpdate,
          time: data.time,
          longestTime: data.longestTime,
          goalRecords: data.goalRecords
        })
      },
      err => {
        showToast('获取失败')
      }
    )
  }
})
