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
  systemInfo: {
    platform: 'ios',
    model: 'iPhone 8',
    windowHeight: 642
  },
  hasHomeBar: false,
  /* promisify */
  request: promisify(wx.request),
  getLocation: promisify(wx.getLocation),
  getSystemInfo: promisify(wx.getSystemInfo),

  onLaunch: async function () {
    wx.hideTabBar()
    let that = this
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
    that.systemInfo =  wx.getStorageSync('systemInfo') || await that.getSystemInfo()
    const model = that.systemInfo.model
    if (model.search('iPhone X') !== -1 || model.search('iPhone 1') !== -1) {
      that.hasHomeBar = true
    }

    that.color = wx.getStorageSync('colorSet') || {
      primaryColor: '#549688',
      backgroundColor: '#f6faf9',
      primaryName: '铜绿',
      tabIndex: 3,
      colorIndex: '5#549688'
    }
    
  },

  onShow: function () {
    wx.hideTabBar()
  },

  getProgress: function () {
    let date = new Date()
    let year = date.getFullYear()
    let yearStart = new Date(year+'/01/01 00:00:00')
    let yearEnd = new Date(year+'/12/31 23:59:59')
    let fullDiff = yearEnd.getTime() - yearStart.getTime()
    let dateDiff = date.getTime() - yearStart.getTime()
    let passedPercent = dateDiff/fullDiff
    return (passedPercent*100).toFixed(1)
    //return 'date:' + date + ' ;yearStart:' + yearStart+ ' ;yearEnd:' + yearEnd
  },

  setDaynight:function () {
    let srss
    try {
      srss = wx.getStorageSync('weathers')[0].daily_forecast[0]
    } catch (error) {
      srss = { sr: '06:00', ss: '18:00' }
    }
    let dayStart = new Date('2018/01/01 00:00')
    let dayEnd = new Date('2018/01/01 23:59')
    let daySr = new Date('2018/01/01 '+ srss.sr)
    let daySs = new Date('2018/01/01 '+srss.ss)
    let fullDiff = dayEnd.getTime() - dayStart.getTime()
    let dayDiff = daySs.getTime() - daySr.getTime()
    let dayPercent = dayDiff/fullDiff
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