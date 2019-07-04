import * as echarts from '../../libs/ec-canvas/echarts'
import pieOptions from '../../config/pieDefOption'
import { showToast } from '../../utils/UIUtil'
import { HomeModel } from '../../models/home'
import { TimerState } from '../../config/timerState'
import { timerFormat } from '../../utils/dateTimeUtil'
import { showModal } from '../../utils/UIUtil'

const globalEnv = getApp()     /*定义全局事件流*/

Page({
  data: {      /*页面数据*/
    removeShow: false,
    trashShow: true,
    xShow: false,
    allShow:false,
    chart: {
      lazyLoad: true     /*图片延迟加载插件*/
    },
    userInfo: null,      /*用户信息表*/
    creatingGoal: false,    /*创建目标*/
    uploadingGoal: false,    /*上传目标*/
    goalList: null,            /*目标列表*/
    wholeTime: '',            /*整体时间*/
    hasInitChart: false,
    timerGoalTitle: '',
    timerGoalId: '',
    timer: '00:00:00',
    timerState: null           /*计时状态*/
  },

  onRemoveGoalMult(){    /*删除目标事件*/
    this.setData({
      removeShow: true,
      trashShow: false,
      xShow: true,
      allShow: true,
    })
  },

  onClearRemoveMult(){
    this.setData({
      removeShow: false,
      trashShow: true,
      xShow: false,
      allShow: false,
    })
  },

  onRemoveGoalAll() {   /*删除全部目标事件*/
    var goalList = this.data.goalList
    showModal('', '是否全部删除', () => {
      for(var i=0; i < goalList.length; i++){
        HomeModel.removeGoal(goalList[i]._id).then(
        res => {
          this.getGoalList()
        },
        err => {
          showToast('删除失败')
        }
      )}
    })
  },

  onRemoveGoal(e) {
    let goalId = e.currentTarget.dataset.goalId
    showModal('', '是否删除' , () => {
      HomeModel.removeGoal(goalId).then(
        res => {
          this.getGoalList()
        },
        err => {
          showToast('删除失败')
        }
      )
    })
  },

  onLoad(options) {   /*在页面或图像加载完成后立即显示用户信息*/
    this.getUserInfo()
  },

  onShow() {    /*监视判断是否进入显示页面*/
    this.getOpenidAndUserId()
    this.setTimerTips()
  },

  onReady() {   /*监听页面初次渲染完成*/
    this.chartComponent = this.selectComponent('#chart')
  },

  onAuthorize(e) {    /*用户授权登录*/
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo
      })
    }
  },

  onCreateGoal() {   /*创建目标事件*/
    if (!this.data.userInfo) {
      showToast('请先授权登录')
      return
    }
    this.setData({
      creatingGoal: true
    })
  },

  onCancelCreate() {  /*输入新的目标事件*/
    this.setData({
      creatingGoal: false
    })
  },

  onNewGoalInput(e) {   /*添加新目标*/
    this.setData({
      newGoalTitle: e.detail.value
    })
  },

  onAddGoal(e) {
    let newGoalTitle = e.detail
    let newActIndex= this.data.actIndex
    if (!newGoalTitle.length) {
      showToast('标题不能为空')
      return
    }

    if (this.data.uploadingGoal) return

    this.data.uploadingGoal = true
    HomeModel.addGoal(globalEnv.data.userId, newGoalTitle, newActIndex).then(
      res => {
        this.setData({
          creatingGoal: false
        })
        this.data.uploadingGoal = false
        showToast('创建成功', true)
        this.getGoalList()
      },
      err => {
        this.setData({
          creatingGoal: false,
          uploadingGoal: false
        })
        showToast('创建失败')
      }
    )
  },

  onGoalClick(e) {   /*点击目标事件*/
    let goalId = e.currentTarget.dataset.goalId

    wx.navigateTo({  /*跳转下一个页面*/
      url: '/pages/detail/index?id=' + goalId
    })
  },

  onCheckTimer() {   /*点击开始记录*/
    wx.navigateTo({
      url:        /*跳转到计时页面*/
        '/pages/timer/index?id=' +
        this.data.timerGoalId +
        '&title=' +
        this.data.timerGoalTitle
    })
  },

  setTimerTips() {   /*提示计时正在进行中或暂停时*/
    let timerInfo = globalEnv.checkExistTimer()
    let stateDesc = ''

    switch (timerInfo.timerState) {   /*计时状态*/
      case TimerState.None:
        stateDesc = ''
        break
      case TimerState.Pause:
        stateDesc = '暂停中'
        this.setData({
          timer: timerFormat(timerInfo.duration),
          timerGoalId: timerInfo.goalId
        })
        break
      case TimerState.Ongoing:
        stateDesc = '进行中'
        this.setData({
          timer: timerFormat(timerInfo.duration)
        })
        globalEnv.startTimer(null, null, duration => {
          this.setData({
            timer: timerFormat(duration),
            timerGoalId: timerInfo.goalId
          })
        })
    }
    this.setData({
      timerState: stateDesc,
      timerGoalTitle: timerInfo.goalTitle
    })
  },

  getUserInfo() {    /*获取用户信息*/
    HomeModel.getUserInfo().then(res => {
      this.setData({
        userInfo: res.userInfo
      })
    })
  },

  getOpenidAndUserId() {    /*获取小程序用户的openId和企业微信的userId*/
    HomeModel.getOpenidAndUserId().then(
      res => {
        let ids = res.result
        globalEnv.data.openid = ids[1]

        if (!ids[0].data.length) {
          this.addUserId()
        } else {
          globalEnv.data.userId = ids[0].data[0]._id
          this.getGoalList()
        }
      },
      err => {
        showToast('登录失败')
      }
    )
  },

  addUserId() {   /*添加企业微信的userId*/
    HomeModel.addUserId().then(
      res => {
        globalEnv.data.userId = res._id
        this.getGoalList()
      },
      err => {
        showToast('添加用户id失败')
      }
    )
  },

  getGoalList() {   /*获取目标列表*/
    if (!globalEnv.data.userId) return
    
    HomeModel.getGoalList(globalEnv.data.userId).then(
      res => {
        if (!res.result) {
          this.setData({
            goalList: []
          })
          return
        }
         /*声明局部变量*/
        let formattedData = HomeModel.formatGoalList(res.result.data)
        this.setData({
          goalList: formattedData.list,
          wholeTime: formattedData.wholeTime
        })
        if (this.data.hasInitChart) {
          this.setChartOption(this.chart)
        } else {
          this.initChart()
        }
      },
      err => {
        showToast('获取目标列表失败')
      }
    )
  },

  initChart() {   /*初始化函数，初始化Chart控件*/   
    this.chartComponent.init((canvas, width, height) => {
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      })
      this.setChartOption(chart)
      this.chart = chart
      this.setData({
        hasInitChart: true
      })
      return chart
    })
  },

  setChartOption(chart) {      /*添加图标插件*/
    let data = HomeModel.serializeForChart(this.data.goalList)
    let option = pieOptions
    option.series[0].data = data
    chart.setOption(option)
  }
})
