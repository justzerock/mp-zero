const config = require('../../libs/config.js');
const hekey = config.heweather.key;
const app = getApp()
let that
Page({
  data: {
    weathers: [],
    swiperCurrent: 0,
    hasHomeBar: false,
    loading: false,
    showUpdate: false,
    showDelBtn: false,
    savedLocation: [],
    lonlat: '116.4052887,39.90498734', //  默认北京坐标
    platform: '',
    deviceHeight: '',
    primaryColor: '',
    backgroundColor: '',
    current: '',
    autoplay: true,
    showLife: false,
    animated: false,
    smallSwiperOpt: {
      autoplay: false,
      circular: true,
      previousMargin: '20rpx',
      nextMargin: '20rpx',
      displayMultipleItems: 2
    }
  },

  onLoad: function () { 
    wx.hideTabBar()
    that = this
    that.setColors()
    that.getSavedLocation()
    that.getWeathers()
    let savedLocation = that.data.savedLocation
    if (savedLocation.length < 1) {
      that.getLocation()
    } else {
      that.getWeather(savedLocation)
    }
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          deviceHeight: res.windowHeight - 50 + 'px',
          platform: res.platform
        });
      }
    });
  },

  getWeathers: function () {
    that.setData({
      weathers: wx.getStorageSync('weathers') || []
    })
  },

  /* 设置主题色 */
  setColors: function () {
    let primaryColor = app.color.primaryColor
    let backgroundColor = app.color.backgroundColor
    this.setData({
      primaryColor: primaryColor,
      backgroundColor: backgroundColor,
      current: 'weather',
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: primaryColor
    })

  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current,
    })
  },

  updateLocation: function (e) {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../city/city?id=' + id
    })
  },

  getWeather: async function (locations) {
    that.setData({
      loading: true
    })
    let weathers = wx.getStorageSync('weathers') || []
    let forceUpdate = wx.getStorageSync('forceUpdate') || false
    let newWeathers = []
    wx.showNavigationBarLoading()
    if ( !forceUpdate && weathers.length > 0) {
      for (let weather of weathers ) {
        let loc = weather.update.loc.replace(/-/g, '/')
        let cid = weather.basic.cid
        let updateTime = new Date(loc).getTime()
        let nowTime = Date.now()
        let difHour = Math.floor((nowTime - updateTime) / (3600 * 1000))
        if (difHour <= 1) {
          newWeathers.push(weather)
        } else {
          let newData = await that.getWeatherData(cid)
          newWeathers.push(newData)
        }
      }
    } else {
      for (let location of locations ) {
        let newData = await that.getWeatherData(location.cid)
        newWeathers.push(newData)
      }
    }
    wx.setStorageSync('forceUpdate', false)
    that.setData({
      weathers: newWeathers,
      showUpdate: true,
    })
    wx.setStorage({
      data: newWeathers,
      key: 'weathers',
    })
    wx.hideNavigationBarLoading()
    that.setData({
      loading: false
    })
    setTimeout(function () {      
      that.setData({
        showUpdate: false
      })
    }, 5000);
  },

  /* 获取天气数据 */
  getWeatherData: async function (cid) {
    let newData = await app.request({
      url: 'https://free-api.heweather.com/s6/weather?',
      data: {
        location: cid,
        key: hekey
      },
      header: {
        'content-type': 'application/json'
      }
    })
    return newData.data.HeWeather6[0]
  },

  /* 获取坐标 */
  getLocation: function () {
    let lonlat = that.data.lonlat
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.getLocationCid(res.longitude + ',' + res.latitude)
      },
      fail: function () {
        that.getLocationCid(lonlat)
      }
    })
  },

  /* 获取地区cid */
  getLocationCid: function (lonlat) {
    let savedLocation = []
    wx.request({
      url: 'https://search.heweather.com/find?',
      data: {
        key: hekey,
        location: lonlat
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.HeWeather6[0].status == 'ok') {
          let location = res.data.HeWeather6[0].basic[0]
          savedLocation.push(location)
          that.getWeather(savedLocation)
          that.setData({
            savedLocation: savedLocation
          })
          wx.setStorage({
            key: 'savedLocation',
            data: savedLocation
          })
          wx.setStorage({
            data: location,
            key: 'currentLocation',
          })
        }
      }
    })
  },

  /* 获取储存的城市 */
  getSavedLocation: function () {
    that.setData({
      savedLocation: wx.getStorageSync('savedLocation') || []
    })
  },

  /* 隐藏删除按钮 */
  hideDelBtn: function () {
    this.setData({
      showDelBtn: false
    })
  },

  /* 显示删除按钮 */
  showDelBtn: function () {
    let showDelBtn = this.data.showDelBtn
    let savedLocation = this.data.savedLocation
    if ( savedLocation.length === 1 ) return
    this.setData({
      showDelBtn: !showDelBtn
    })
  },

  /* 删除天气 */
  delWeather: function (e) {
    console.log('del')
    let cid = e.currentTarget.id
    let weathers = this.data.weathers
    let savedLocation = this.data.savedLocation
    let index = savedLocation.findIndex(item => item.cid === cid)
    savedLocation.splice(index, 1)
    weathers.splice(index, 1)
    if (savedLocation.length === 0) {
      wx.setStorageSync('forceUpdate', true)
      this.getLocation()
    } else {
      this.setData({
        weathers: weathers,
        savedLocation: savedLocation
      })
      wx.setStorageSync('weathers', weathers)
      wx.setStorageSync('savedLocation', savedLocation)
    }
    this.hideDelBtn()
  },

  onPullDownRefresh: function () {
    wx.setStorageSync('forceUpdate', true)
    this.getWeather(this.data.savedLocation)
    wx.stopPullDownRefresh()    
  },

  showDayTmp: function (e) {
    that.setData({
      autoplay: false
    })
    let index = e.currentTarget.dataset.index
    let dayTmp = that.data.weather.daily_forecast[index]
    let content = '日升：'+ dayTmp.sr 
      + '\n' + '日落：' + dayTmp.ss 
      + '\n' + '降水概率：' + dayTmp.pop + '%'
      + '\n' + '相对湿度：' + ' ' + dayTmp.hum + '%'
      + '\n' + dayTmp.wind_dir + ' ' + dayTmp.wind_sc + '级'
    wx.showModal({
      title: dayTmp.date + ' ' + dayTmp.cond_txt_d,
      content: content,
      showCancel: false,
      confirmText: '了解',
      confirmColor: that.data.primaryColor,
      success (res) {
        if (res.confirm) {
          that.setData({
            autoplay: true
          })
        }
      }
    })
  },

  /* 显示小程序时调用onLoad() */
  onShow: function () {
    this.onLoad()
  },

  onHide: function () {
  },

  onReady: () => {
    that.setData({
      hasHomeBar: app.hasHomeBar
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let weathers = this.data.weathers
    let swiperCurrent = this.data.swiperCurrent
    let title 
    if (swiperCurrent == weathers.length) {
      title = '知晴否'
    } else {
      let weather = weathers[swiperCurrent]
      let city = 
        weather.basic.location === weather.basic.parent_city ? 
        weather.basic.location : 
        weather.basic.parent_city + ' ' + weather.basic.location
      title = city + ' ' + weather.now.cond_txt + ' ' + weather.now.tmp + '°'
    }
    return {
      title: title,
      imageUrl: ''
    }
  },

})