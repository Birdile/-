import { timerFormat } from '../../utils/dateTimeUtil'
import { showModal } from '../../utils/UIUtil'
import { TimerState } from '../../config/timerState'

const globalEnv = getApp()

Page({
  data: {        /*页面数据*/
    goalTitle: '',
    goalId: '',
    isOngoing: true,          /*正在进行中*/
    pauseImg: '../../images/timer/pause.png',    /*暂停计时*/
    resumeImg: '../../images/timer/resume.png',   /*继续计时*/
    timer: '00:00:00',
  },

  onLoad(options) {       /*在页面或图像加载完成后立即显示用户信息*/
    this.setData({
      goalTitle: decodeURIComponent(options.title),
      goalId: options.id
    })
    this.initCounter()
  },

  onPauseOrResume() {   /*中断或继续*/
    this.setData({
      isOngoing: !this.data.isOngoing
    })
    this.data.isOngoing ? this.startCounter() : this.pauseCounter()
  },

  onFinish() {     /*结束*/
    let timerInfo = globalEnv.checkExistTimer()

    let { beginDate, duration } = { ...timerInfo }

    this.stopCounter()

    wx.redirectTo({         /*关闭当前页面，跳转到下一个页面*/
      url:
        '/pages/summary/index?id=' +
        this.data.goalId +
        '&title=' +
        encodeURIComponent(this.data.goalTitle) +
        '&begin=' +
        beginDate +
        '&end=' +
        new Date() +
        '&duration=' +
        duration
    })
  },

  onAbort() {   /*取消本次记录*/
    showModal(
      '',
      '是否取消本次记录',
      () => {
        this.stopCounter()
        wx.navigateBack({
          delta: 1
        })
      },
      null
    )
  },

  initCounter() {    /*初始化计时器*/
    let timerInfo = globalEnv.checkExistTimer()

    switch (timerInfo.timerState) {
      case TimerState.Ongoing:
      case TimerState.None:
        this.setData({
          timer: timerFormat(timerInfo.duration)
        })
        this.startCounter()
        break
      case TimerState.Pause:
        this.setData({
          timer: timerFormat(timerInfo.duration),
          isOngoing: false
        })
        break
    }
  },

  startCounter() {   /*开始计时*/
    this.setData({
      isOngoing: true
    })

    globalEnv.startTimer(this.data.goalId, this.data.goalTitle, duration => {
      this.setData({
        timer: timerFormat(duration)
      })
    })
  },

  pauseCounter() {     /*暂停计时*/
    globalEnv.pauseTimer()
  },

  stopCounter() {     /*结束计时*/
    globalEnv.stopTimer()
  }
})
