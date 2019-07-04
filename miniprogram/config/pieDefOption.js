/*输出错误*/
export default {
  backgroundColor: 'transparent',      /*背景色：透明的*/
 

/*提示工具*/
  tooltip: {
    trigger: 'item',     /*触发项目*/
    formatter: '{b}  {a}: {c} 小时 ({d}%)' /*格式说明*/
  },

  /*属性设置*/
  visualMap: {
    show: false,
    min: 0,
    max: 8,
    inRange: {  /*双阈值化操作，将两个阈值内的像素值设置为白色（255），而不在阈值区间的像素值设置为黑色*/
      colorLightness: [0.8, 0.46]  /*颜色的明暗度*/
    }
  },
  series: [{
    name: '累计',
    type: 'pie',
    radius: '70%',   /*半径范围*/
    center: ['50%', '50%'],    /*中心位置*/
    data: [
      { value: 0, name: '暂无数据' }
    ],
    roseType: 'radius',
    label: {   /*标签*/
      normal: {
        textStyle: {      /*文本格式*/
          color: 'rgba(0, 0, 0, 0.6)'
        }
      }
    },
    labelLine: {   /*标示线*/
      normal: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.1)'
        },
        length: 10,
        length2: 10
      }
    },
    itemStyle: {     /*项目格式*/
      color: {
        type: 'linear',
        x: 0,
        y: 0,
        x2: 0,
        y2: 1,
        colorStops: [{
          offset: 0, color: '#0a2647' // 0% 处的颜色
        }, {
          offset: 1, color: '#1565c0' // 100% 处的颜色
        }],
        global: false
      },
      borderWidth: 1,
      borderColor: 'white'
    },

    animationType: 'scale',     /*动画类型*/
    animationEasing: 'elasticOut',      /*缓动函数：调整速度和振幅*/
    animationDelay: function (idx) {     /*动画延迟*/
      return Math.random() * 200
    }
  }],

}