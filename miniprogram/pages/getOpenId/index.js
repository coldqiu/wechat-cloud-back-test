Page({

  /**
   * 页面的初始数据
   */
  data: {
    showUploadTip: false,
    haveGetOpenId: false,
    envId: '',
    openId: '',
    avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
  },

  onLoad(options) {
    this.setData({
      envId: options.envId
    });
  },

  getOpenId() {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.envId
      },
      data: {
        type: 'getOpenId'
      }
    }).then((resp) => {
      console.log('resp: ', resp);
      this.setData({
        haveGetOpenId: true,
        openId: resp.result.openid
      });
      wx.hideLoading();
    }).catch((e) => {
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  },

  clearOpenId() {
    this.setData({
      haveGetOpenId: false,
      openId: ''
    });
  },
  handleTest1() {
    wx.cloud.callFunction({
      name: 'test-1',
      config: {
        env: this.data.envId
      },
    }).then(res => {
      console.log("handleTest1 res", res)
    }).catch(e => {
      console.log("handleTest1 e", e)
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl,
    })
  },


});