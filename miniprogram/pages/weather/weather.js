var config = require('../../libs/config.js');
var key = config.heweather.key;
var app = getApp()
Page({
  data: {
    nowtext: 'Now',
    weather: '',
    swiperCurrent: 0,
    now: 'flex',
    life: 'none',
    btntext: '未来一日',
    loading: false,
    refreshing: false,
    showrefresh: false,
    savedCity: '',
    lonlat: '116.4052887,39.90498734', //  默认北京坐标
    platform: '',
    deviceHeight: '',
    primaryColor: '',
    backgroundColor: '',
    styleBtn: '',
    current: '',
    set: true,
    autoplay: true,
    showLife: false,
    animated: false
  },

  onLoad: function () {
    wx.hideTabBar()    
    var that = this
    that.setColors()
    that.getSavedCity()
    var savedCity = that.data.savedCity
    if (savedCity == '') {
      that.getLocatAndWeather()
    } else {
      that.getWeather(savedCity.lonlat, savedCity.city)
    }
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          deviceHeight: res.windowHeight - 50 + 'px',
          platform: res.platform
        });
      }
    });
    var dark = this.data.primaryColor
    var light = this.data.backgroundColor
    var styleBtn = 'color:' + dark + ';background:' + light + ';'
    that.setData({
      styleBtn: styleBtn
    })
  },

  /* 设置主题色 */
  setColors: function () {
    var primaryColor = app.color.primaryColor
    var backgroundColor = app.color.backgroundColor
    var set = config.shadeColor(primaryColor)
    this.setData({
      primaryColor: primaryColor,
      backgroundColor: backgroundColor,
      current: 'weather',
      set: set
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: set ? primaryColor : backgroundColor,
    })

    wx.setTabBarStyle({
      selectedColor: set ? primaryColor : backgroundColor,
      backgroundColor: set ? backgroundColor : primaryColor
    })
  },

  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current,
    })
  },

  switchCard: function () {
    var now = this.data.now
    var life = this.data.life
    var dark = this.data.primaryColor
    var light = this.data.backgroundColor
    var text = now == 'flex' ? '实时天气' : '未来一日'
    var styleBtn = now == 'flex' ? 'color:' + light + ';background:' + dark + ';' : 'color:' + dark + ';background:' + light + ';'
    this.setData({
      now: life,
      life: now,
      btntext: text,
      styleBtn: styleBtn
    })
  },
  showlife: function (e) {
    var that = this
    var animated = that.data.animated
    that.setData({
      animated: true
    })
    var showLife = that.data.showLife
    setTimeout(function() {
      that.setData({
        showLife: !showLife,
        animated: false
      })
    }, 300)
    /* wx.showModal({
      title: '',
      content: e.currentTarget.dataset.lifeTxt,
      showCancel: false,
      confirmText: '明白',
      confirmColor: this.data.primaryColor,
    }) */
  },
  searchcity: function () {
    wx.navigateTo({
      url: '../city/city',
    })
  },
  getWeather: function (lonlat, city) {
    var that = this
    that.setData({
      loading: true,
      refreshing: true
    })
    var weather = wx.getStorageSync('weatherData') || ''
    if (weather != '') {
      var loc = weather.update.loc.replace(/-/g, '/') || new Date()
      var location = weather.basic.location || ''
      var updateTime = new Date(loc)
      var nowTime = new Date()
      var difTime = nowTime.getTime() - updateTime.getTime()
      var difHour = Math.floor(difTime / (3600 * 1000))
      if (location == city && difHour <= 2) {
        that.setData({
          weather: weather,
        })
        setTimeout(function () {
          that.setData({
            refreshing: false,
            loading: false
          })
        }, 500);
        return
      }
    }
    wx.showNavigationBarLoading()
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather?',
      data: {
        location: lonlat,
        key: key
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          weather: res.data.HeWeather6[0]
        })
        wx.setStorage({
          key: 'weatherData',
          data: res.data.HeWeather6[0]
        })
      },
      complete: function () {
        wx.hideNavigationBarLoading()
        setTimeout(function () {
          that.setData({
            refreshing: false,
            loading: false
          })
        }, 500);
      }
    })
  },

  /* 获取天气 */
  getLocatAndWeather: function () {
    var that = this
    var lonlat = that.data.lonlat
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.getWeather(res.longitude + ',' + res.latitude, '')
      },
      fail: function () {
        that.getWeather(lonlat, '北京')
      }
    })
  },

  /* 获取储存的城市 */
  getSavedCity: function () {
    var that = this
    that.setData({
      savedCity: wx.getStorageSync('savedCity') || ''
    })
  },

  /* 显示小程序时调用onLoad() */
  onShow: function () {
    this.onLoad()
  },

  /* 点击Now时更新数据 */
  upd: function () {
    this.getWeather(this.data.savedCity.lonlat||this.data.lonlat, '')
  },

  /* 显示隐藏更新按钮 */
  showrefresh: function () {
    var showrefresh = this.data.showrefresh
    var loading = this.data.loading
    this.setData({
      showrefresh: loading ? false : !showrefresh
    })
  },

  onPullDownRefresh: function () {
    this.getWeather(this.data.savedCity.lonlat || this.data.lonlat, '')
    wx.stopPullDownRefresh()    
  },

  showDayTmp: function (e) {
    var that = this
    that.setData({
      autoplay: false
    })
    var set = that.data.set
    var pc = that.data.primaryColor
    var bc = that.data.backgroundColor
    var index = e.currentTarget.dataset.index
    var dayTmp = that.data.weather.daily_forecast[index]
    var content = '日升：'+ dayTmp.sr 
      + '\n' + '日落：' + dayTmp.ss 
      + '\n' + '降水概率：' + dayTmp.pop + '%'
      + '\n' + '相对湿度：' + ' ' + dayTmp.hum + '%'
      + '\n' + dayTmp.wind_dir + ' ' + dayTmp.wind_sc + '级'
    wx.showModal({
      title: dayTmp.date + ' ' + dayTmp.cond_txt_d,
      content: content,
      showCancel: false,
      confirmText: '了解',
      confirmColor: set?pc:bc,
      success (res) {
        if (res.confirm) {
          that.setData({
            autoplay: true
          })
        }
      }
    })
  }

})