// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud-of-lxb-gkzcx'
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = wxContext.OPENID;
  var team=event.team;var name=event.name;
  try {
    return await db.collection('admin').where({
      team:team,financeName:name
    }).update({
      data:{
        openId:openid
      }
    })
  } catch (e) {
    console.error(e)
  }
}