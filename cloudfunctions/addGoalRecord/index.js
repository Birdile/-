/*云函数入口文件*/
const cloud = require('wx-server-sdk')

cloud.init()
/*初始化数据库*/
const db = cloud.database()
const _ = db.command

/*云函数入口函数*/
exports.main = async (event, context) => {
  /*创建局部事件流*/
  let goalId = event.goalId
  let beginDate = event.beginDate
  let endDate = event.endDate
  let summary = event.summary
  let time = event.time
/*没有目标用户ID时，返回数据库等待目标收集*/
  if(!goalId) return

  try {
    await db    /*等待数据库*/
      .collection('goal-records')
      .where({
        goalId
      })
      .update({     /*更新数据库*/
        data: {
          records: _.push([
            {
              summary,
              beginDate,
              endDate,
              time
            }
          ])
        }
      })

    await db
      .collection('goals')
      .doc(goalId)
      .update({
        data: {
          time: _.inc(parseInt(time)),     /*返回time*/
          lastUpdate: endDate
        }
      })
  } catch (e) {      /*捕捉并抛出异常*/
    console.log(e)
  }
}
