var config = require('../../libs/config.js');
var key = config.heweather.key;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentLonLat: {
      lonlat: '',
      city: '定位中……'
    },  //  当前定位坐标城市
    cityTop: '', //  热门城市数据
    keyword: '', //  搜索关键词
    citylist: '',  //  搜索关联城市
    cityTip: '', //  搜索提示
    locatHistory: '',  //  历史城市数据
    clearIcon: '', //  清除文字图标
    focus: '',  //  聚焦状态
    loading: false, //  加载动画
    primaryColor: '',
    backgroundColor: '',
    set: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    that.setColors()
    //判断是否获得了用户地理位置授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation'])
          that.openConfirm()
      }
    })
    that.getMyLocation()
    //  获取已缓存的热门城市
    wx.getStorage({
      key: 'cityTop',
      success: function (res) {
        that.setData({
          cityTop: res.data
        })
      },
      fail: function () {
        //  否则获取网络的城市列表并缓存
        that.getCityTop()
      }
    })
    //  获取搜索历史
    that.getCityData()
  },

  onShow: function () {
    this.getMyLocation()
  },

  /* 设置主题色 */
  setColors: function () {
    var primaryColor = app.color.primaryColor
    var backgroundColor = app.color.backgroundColor
    var set = config.shadeColor(primaryColor)
    this.setData({
      primaryColor: primaryColor,
      backgroundColor: backgroundColor,
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

  /* 获取当前定位 */
  getMyLocation: function () {
    var that = this
    var currentLonLat = wx.getStorageSync('currentLonLat') || ''
    wx.getLocation({
      type: 'wgs84',
      success: function (gps) {
        var lonlat = gps.longitude + ',' + gps.latitude
        if (currentLonLat != '') {
          if (currentLonLat.lonlat == lonlat) {
            that.setData({
              currentLonLat: currentLonLat
            })
            return
          }
        }
        wx.request({
          url: 'https://search.heweather.com/find?',
          data: {
            key: key,
            location: lonlat
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.HeWeather6[0].status == 'ok') {
              var city = res.data.HeWeather6[0].basic[0].location
              that.setData({
                currentLonLat: {
                  lonlat: lonlat,
                  city: city
                }
              })
              wx.setStorage({
                key: 'currentLonLat',
                data: {
                  lonlat: lonlat,
                  city: city
                }
              })
            } else {
              that.setData({
                currentLonLat: {
                  lonlat: lonlat,
                  city: '无法定位'
                }
              })
            }
          },
          fail: function () {
            that.setData({
              currentLonLat: {
                lonlat: lonlat,
                city: '稍后重试'
              }
            })
          }
        })
      }
    })
  },

  /* 缓存搜索的数据，6条 */
  setCityData: function (obj) {
    var that = this
    try {
      var citydata = wx.getStorageSync('locatHistory')
      if (citydata != '') {
        var flags = true
        //  检查城市名是否已缓存
        for (let i in citydata) {
          if (citydata[i].city == obj.city) {
            flags = false
          }
        }
        if (flags) {
          citydata.push(obj)
          //  数据超过6条，删除第一条
          if (citydata.length > 6) {
            citydata.splice(0, 1)
          }
        }
        try {
          wx.setStorageSync('locatHistory', citydata)
        } catch (e) {
        }
      } else {
        citydata.push(obj)
        try {
          wx.setStorageSync('locatHistory', citydata)
        } catch (e) {
        }
      }
    } catch (e) {
      var citydata = []
      citydata.push(obj)
      try {
        wx.setStorageSync('locatHistory', citydata)
      } catch (e) {
      }
    }
    try {
      wx.setStorageSync('savedCity', obj)
    } catch (e) {
    }
    wx.navigateBack({
    })
  },

  /* 获取搜索过的城市缓存 */
  getCityData: function () {
    var that = this
    try {
      var citydata = wx.getStorageSync("locatHistory")
      if (citydata != '') {
        that.setData({
          locatHistory: citydata
        })
      }
    } catch (e) {
    }
  },

  focus: function () {
    var that = this
    that.setData({
      focus: "focus"
    })
  },

  blur: function () {
    var that = this
    that.setData({
      focus: ""
    })
  },

  /* 获取热门城市，中国，15个 */
  getCityTop: function () {
    var that = this
    wx.request({
      url: 'https://search.heweather.com/top?',
      data: {
        group: 'cn',
        key: key,
        number: 15
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        that.setData({
          cityTop: res.data.HeWeather6[0].basic
        })
        wx.setStorage({
          key: 'cityTop',
          data: res.data.HeWeather6[0].basic,
        })
      }
    })
  },

  /* 清空历史缓存 */
  clearHis: function () {
    var that = this
    wx.removeStorage({
      key: 'locatHistory',
      success: function (res) {
        that.setData({
          locatHistory: ''
        })
      },
    })
  },

  /* 搜索天气 */
  weather: function (e) {
    var that = this
    var city = e.currentTarget.dataset.location
    var lonlat = e.currentTarget.dataset.lonLat
    if (lonlat == '') return
    var citydata = { 'city': city, 'lonlat': lonlat }
    //  存储搜索的城市数据
    that.setCityData(citydata)
  },

  openConfirm: function () {
    var that = this
    wx.showModal({
      content: '检测到您没打开小程序的定位权限，是否去设置打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        //点击“确认”时打开设置页面
        if (res.confirm) {
          wx.openSetting()
        } else {
        }
      }
    });
  },


  /* 按键盘确认键直接搜索第一个城市 */
  getFirst: function () {
    var that = this
    var keyword = that.data.keyword
    var citylist = that.data.citylist
    var firstcity = ''
    if (citylist != '' && citylist.length > 0) {
      firstcity = citylist[0]
    }
    if (keyword == '' || firstcity == '') return
    firstcity = {
      'city': firstcity.location,
      'lonlat': firstcity.lon + ',' + firstcity.lat
    }
    // 存储城市数据
    that.setCityData(firstcity)
  },

  /* 清空关键词 */
  clearkeyword: function () {
    var that = this
    that.setData({
      keyword: '',
      clearIcon: '',
      citylist: '',
      cityTip: '',
      loading: false
    })
  },

  /* 检测输入框变化 */
  inputkeyword: function (e) {
    var that = this
    that.setData({
      keyword: e.detail.value.trim()
    })
    if (e.detail.value.trim().length == 0) {
      that.setData({
        clearIcon: '',
        loading: false,
        citylist: ''
      })
    } else {
      that.setData({
        clearIcon: 'show',
        loading: true
      })
      //  获取关联城市数据，中国，10条
      wx.request({
        url: 'https://search.heweather.com/find?',
        data: {
          group: 'cn',
          key: key,
          number: 10,
          location: e.detail.value
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.HeWeather6[0].status == 'ok') {
            that.setData({
              citylist: res.data.HeWeather6[0].basic,
              cityTip: ''
            })
          } else {
            that.setData({
              citylist: '',
              cityTip: '未找到相关城市'
            })
          }
        },
        fail: function () {
          that.setData({
            citylist: '',
            cityTip: '大概是网络故障'
          })
        }
      })
    }
  },

})