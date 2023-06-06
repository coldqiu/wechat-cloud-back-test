const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();


// 存储用户 openId

exports.main = async (event, context) => {
  // 获取 openId wxContext.OPENID,
  const wxContext = cloud.getWXContext();
  db.collection('users').doc(wxContext.OPENID).get({
    success: function (res) {
      // res.data 包含该记录的数据
      console.log("老用户", res.data)
      // return { code: 200, msg: '老用户', showMsg: false, event, context }
      return { code: 200, msg: '老用户', showMsg: false}
    },
    fail: async function (e) {
      console.log("add user fail e", e)
      try {
        const asdf = await db.collection('users').add({
          data: {
            _id: wxContext.OPENID,
            ...wxContext
          }
        })
        return "add success"
      } catch (e) {
        console.error(e)
        return "add fail"
      }
    }
  })
}