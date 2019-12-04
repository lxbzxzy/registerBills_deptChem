// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud-of-lxb-gkzcx'
})
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  try {
    return await db.collection('bill').doc(event.doc).remove()
  } catch (e) {
    console.error(e)
  }
}