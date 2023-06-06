const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();


// 存储用户 openId

exports.main = async (event, context) => {
  // 获取 openId wxContext.OPENID,
  const wxContext = cloud.getWXContext();
  let result = ""
  await db.collection('users').doc(wxContext.OPENID).get().then((res) => {
    console.log('res: ', res)
    // return { code: 200, msg: '老用户', showMsg: false }
    // return "success"
    result = { code: 200, msg: '老用户' }
  }).catch(async (e) => {
    // console.log("promise catch", e)
    console.log("promise catch", e)
    try {
      const asdf = await db.collection('users').add({
        // const asdf = await db.collection('users').add({
        data: {
          _id: wxContext.OPENID,
          createTime: Date.now().toString(),
          ...wxContext
        }
      })
      result = "add success"
    } catch (e) {
      console.error(e)
      result = "add fail"
    }
  })
  // return "success"
  return result
}