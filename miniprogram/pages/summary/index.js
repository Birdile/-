import {
  dateFormat,   /*日期格式化*/
  timeFormat,   /*时间格式化*/
  durationFormatText    /*持续时间文本格式化*/
} from '../../utils/dateTimeUtil'
import { SummaryModel } from '../../models/summary'
import { showToast } from '../../utils/UIUtil'

Page({
  data: {     /*页面数据*/
    goalId: '',
    goalTitle: '',
    begin: '',
    beginTime: '',   /*开始时间*/
    beginDate: '',
    end: '',
    endTime: '',    /*结束时间*/
    endDate: '',  
    duration: 0, /*持续时间*/
    durationText: '',  /*持续时间文本*/
    summary: '',            /*总结*/
    uploadingSummary: false        /*上传总结*/
  },

  onLoad(options) {       /*在页面或图像加载完成后立即显示用户信息*/
    this.data.goalId = options.id
    this.data.begin = options.begin
    this.data.end = options.end
    this.data.duration = options.duration

    this.setData({
      goalTitle: decodeURIComponent(options.title),
      beginTime: timeFormat(options.begin),
      beginDate: dateFormat(options.begin),
      endTime: timeFormat(options.end),
      endDate: dateFormat(options.end),
      durationText: durationFormatText(options.duration)
    })
  },

  onSummaryInput(e) {      /*输入总结*/
    this.setData({
      summary: e.detail.value
    })
  },

  onSubmit() {        /*提交*/
    if (this.data.uploadingSummary) return

    this.data.uploadingSummary = true
    SummaryModel.addGoalRecord(   /*调加目标记录*/
      this.data.goalId,
      this.data.begin,
      this.data.end,
      this.data.duration,
      this.data.summary ? this.data.summary : '无标题'
    ).then(
      res => {
        showToast('提交成功', true)
        wx.navigateBack({
          delta: 1
        })
      },
      err => {
        this.data.uploadingSummary = false
        showToast('提交失败')
      }
    )
  }
})
