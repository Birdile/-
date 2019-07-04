import { TimerState } from './config/timerState'
import { countDuration } from './utils/dateTimeUtil'
/*小程序初始化*/
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true
      })
    }

    this.data = {
      timerId: -1,    /*定时器*/
      timerState: TimerState.None,    /*时间状态*/
      duration: 0,     /*持续时间*/
      goalId: '',      /*目标用户ID*/
      goalTitle: '',    /*标题*/
      beginDate: null,   /*开始时间*/
      hideDate: null,    /*隐藏时间*/
      hideDuration: 0,   /*隐藏持续时间*/
      lastShowDuration: 0    /*最终显示持续时间*/
    }
  },

  onShow() {     /*监视判断是否进入显示页面*/
    let hideDate = this.data.hideDate
    if (!hideDate) return    /*判断是否已经创建了请求*/

    console.log(this.data.lastShowDuration, countDuration(hideDate, new Date()))  /*调用console.log函数，查看调用的一瞬间指定变量或表达式的值*/
    this.data.duration =
      this.data.lastShowDuration + countDuration(hideDate, new Date())
      
    this.data.hideDate = null
  },

  onHide() {    /*监视页面退出和隐藏*/
    if (this.data.timerState !== TimerState.Ongoing) return
    
    this.data.hideDate = new Date()
    this.data.lastShowDuration = this.data.duration
  },

  startTimer(goalId, goalTitle, onCount) {   /*开始计时*/
    if (this.data.timerState === TimerState.None) {
      this.data.goalId = goalId
      this.data.goalTitle = goalTitle
      this.data.beginDate = new Date()
    }

    this.data.timerState = TimerState.Ongoing

    if (this.data.timerId !== -1) {
      clearInterval(this.data.timerId)   /*显示当前时间*/
    }

    onCount(this.data.duration++)
    let timerId = setInterval(() => {   /*设置停止和循环*/
      onCount(this.data.duration++)
    }, 1000)
    this.data.timerId = timerId
  },

  pauseTimer() {   /*暂停计时*/
    clearInterval(this.data.timerId)
    this.data.timerId = -1
    this.data.timerState = TimerState.Pause
  },

  stopTimer() {    /*停止计时*/
    clearInterval(this.data.timerId)   /*显示当前时间*/
    this.data.timerId = -1
    this.data.timerState = TimerState.None
    this.data.goalId = ''
    this.data.goalTitle = ''
    this.data.duration = 0
    this.data.lastShowDuration = 0
    this.data.hideDuration = 0
    this.data.beginDate = null
    this.data.hideDate = null
  },

  checkExistTimer() {    /*查看已存在的时间*/
    return this.data
  }
})
