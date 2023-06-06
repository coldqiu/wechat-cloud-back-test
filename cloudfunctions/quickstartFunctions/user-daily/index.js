const cloud = require('wx-server-sdk');
const dayjs = require('dayjs')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();

exports.main = async (event, context) => {
    // 用户登录  “存储登录过的用户” 与 “用户登录后 活力值加一（每日一次）”
    const log = cloud.logger();
    const wxContext = cloud.getWXContext();
    let result = "null-asdf-1"

    await db.collection('users').doc(wxContext.OPENID).get().then(async (res) => {
        // debugger
        const oldVal = dayjs(Number(res.data.lastModified)).endOf('day')
        const newVal = dayjs().endOf('day')
        const oneDay = 24 * 60 * 60 * 1000
        const delta = (newVal - oldVal) / oneDay
        // 已经 delta 天没有上线
        if (delta > 0) {
            let newCounter = res.data.counter + 1
            await db.collection('users').doc(wxContext.OPENID).update({
                // data 传入需要局部更新的数据
                data: {
                    counter: newCounter,
                    lastModified: Date.now()
                }

            }).then(() => {
                result = { code: 200, msg: "", counter: newCounter }
                console.log('success result: ', result);
            }).catch((error) => {
                result = { code: 500, msg: '更新用户信息失败', error }
                console.log('fail result: ', result);
                log.error({ code: 500, msg: '更新用户信息失败', error })
            })
        }
    }).catch(async (error) => {
        result = { code: 500, msg: '查询用户信息失败', error }
        log.error({ code: 500, msg: '查询用户信息失败', error })
    })

    return result
}