//app.js
App({
  color: {
    primaryColor: '#549688',
    backgroundColor: '#f6faf9',
    primaryName: '铜绿',
    tabIndex: 3,
    colorIndex: '5#549688'
  },
  globalData: {
    openid: ''
  },
  /* promisify */
  request: promisify(wx.request),
  getLocation: promisify(wx.getLocation),

  onLaunch: function () {
    wx.hideTabBar()
    var that = this
    that.color = wx.getStorageSync('colorSet') || {
      primaryColor: '#549688',
      backgroundColor: '#f6faf9',
      primaryName: '铜绿',
      tabIndex: 3,
      colorIndex: '5#549688'
    }
    
    wx.cloud.init({
      traceUser: true,
    })

    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.globalData.openid = res.data
      },
      fail: function() {
        that.onGetOpenid()
      }
    })
  },

  onShow: function () {
    wx.hideTabBar()
  },

  getProgress: function () {
    var date = new Date()
    var year = date.getFullYear()
    var yearStart = new Date(year+'/01/01 00:00:00')
    var yearEnd = new Date(year+'/12/31 23:59:59')
    var fullDiff = yearEnd.getTime() - yearStart.getTime()
    var dateDiff = date.getTime() - yearStart.getTime()
    var passedPercent = dateDiff/fullDiff
    return (passedPercent*100).toFixed(1)
    //return 'date:' + date + ' ;yearStart:' + yearStart+ ' ;yearEnd:' + yearEnd
  },

  setDaynight:function () {
    var srss = wx.getStorageSync('weathers')[0].daily_forecast[0] || { sr: '06:00', ss: '18:00' }
    var dayStart = new Date('2018/01/01 00:00')
    var dayEnd = new Date('2018/01/01 23:59')
    var daySr = new Date('2018/01/01 '+ srss.sr)
    var daySs = new Date('2018/01/01 '+srss.ss)
    var fullDiff = dayEnd.getTime() - dayStart.getTime()
    var dayDiff = daySs.getTime() - daySr.getTime()
    var dayPercent = dayDiff/fullDiff
    return (dayPercent*100).toFixed(1)
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        this.globalData.openid = res.result.openid
        wx.setStorage({
          key: 'openid',
          data: res.result.openid,
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

})

/*
 * author: 老张
 * title: 将小程序原生异步函数promisify后，在async/await中使用
 * link: https://developers.weixin.qq.com/community/develop/article/doc/00028cbc2e04e0ddf549d535351c13
 */
function promisify(api) {
  return (opt, ...arg) => {
    return new Promise((resolve, reject) => {
      api(Object.assign({}, opt, { success: resolve, fail: reject }), ...arg)
    })
  }
}