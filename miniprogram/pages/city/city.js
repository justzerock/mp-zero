const config = require('../../libs/config.js');
const key = config.heweather.key;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentLocation: {
      cid: '',
      location: '定位中……'
    },  //  当前定位坐标城市
    locationTop: '', //  热门城市数据
    keyword: '', //  搜索关键词
    locationList: '',  //  搜索关联城市
    cityTip: '', //  搜索提示
    locationHistory: '',  //  历史城市数据
    clearIcon: '', //  清除文字图标
    focus: '',  //  聚焦状态
    loading: false, //  加载动画
    primaryColor: '',
    backgroundColor: '',
    originCid: '',
    loadingLocation: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let that = this
    that.setData({
      originCid: option.id
    })
    that.setColors()
    //判断是否获得了用户地理位置授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.userLocation'])
          that.openConfirm()
      }
    })
    that.getCurrentLocation()
    //  获取已缓存的热门城市
    wx.getStorage({
      key: 'locationTop',
      success: function (res) {
        that.setData({
          locationTop: res.data
        })
      },
      fail: function () {
        //  否则获取网络的城市列表并缓存
        that.getLocationTop()
      }
    })
    //  获取搜索历史
    that.getLocationData()
  },

  onShow: function () {
    //this.getMyLocation()
  },

  /* 设置主题色 */
  setColors: function () {
    let primaryColor = app.color.primaryColor
    let backgroundColor = app.color.backgroundColor
    this.setData({
      primaryColor: primaryColor,
      backgroundColor: backgroundColor
    })

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: primaryColor,
    })

  },

  /* 获取缓存的当前位置 */
  getCurrentLocation: function () {
    let currentLocation = wx.getStorageSync('currentLocation') || {}
    if (currentLocation === {}) {
      this.getMyLocation()
    } else {
      this.setData({
        currentLocation: currentLocation
      })
    }
  },

  /* 获取当前定位 */
  getMyLocation: async function () {
    let that = this
    that.setData({
      loadingLocation: true
    })
    let lonlatData = await app.getLocation({type: 'wgs84'})
    let locationData = await app.request({
      url: 'https://search.heweather.com/find?',
      data: {
        key: key,
        location: lonlatData.longitude + ',' + lonlatData.latitude
      },
      header: {
        'content-type': 'application/json'
      },
    })
    that.setData({
      currentLocation: locationData.data.HeWeather6[0].basic[0]
    })
    that.setData({
      loadingLocation: false
    })
  },

  /* 缓存搜索的数据，6条 */
  setLocationData: function ({cid, location}) {
    let that = this
    let originCid = that.data.originCid
    let locationHistory = wx.getStorageSync('locationHistory') || []
    if (locationHistory !== []) {

      let locationIndex = locationHistory.findIndex(item => item.cid === cid)

      if (locationIndex === -1) {
        locationHistory.push({cid, location})
        if (locationHistory.length > 6) {
          locationHistory.splice(0, 1)
        }
      }
    } else {
      locationHistory.push({cid, location})
    }
    wx.setStorageSync('locationHistory', locationHistory)

    let savedLocation = wx.getStorageSync('savedLocation') || []
    if ( originCid !== 'new' ) {
      let locationIndex = savedLocation.findIndex(item => item.cid === originCid)
      savedLocation[locationIndex] = {cid, location}
    } else {
      savedLocation.push({cid, location})
    }
    wx.setStorageSync('savedLocation', savedLocation)
    wx.setStorageSync('forceUpdate', true)
    wx.navigateBack({})
  },

  /* 获取搜索过的城市缓存 */
  getLocationData: function () {
    let that = this
    let locationHistory = wx.getStorageSync("locationHistory") || []
    if (locationHistory !== []) {
      that.setData({
        locationHistory: locationHistory
      })
    }
  },

  focus: function () {
    let that = this
    that.setData({
      focus: "focus"
    })
  },

  blur: function () {
    let that = this
    that.setData({
      focus: ""
    })
  },

  /* 获取热门城市，中国，15个 */
  getLocationTop: async function () {
    let that = this
    let locationTopData = await app.request({
      url: 'https://search.heweather.com/top?',
      data: {
        group: 'cn',
        key: key,
        number: 15
      },
      header: {
        'content-type': 'application/json'
      }
    })
    let locationTop = locationTopData.data.HeWeather6[0].basic
    that.setData({
      locationTop: locationTop
    })
    wx.setStorage({
      data: locationTop,
      key: 'locationTop',
    })
  },

  /* 清空历史缓存 */
  clearHis: function () {
    let that = this
    wx.removeStorage({
      key: 'locationHistory',
      success: function (res) {
        that.setData({
          locationHistory: ''
        })
      },
    })
  },

  /* 搜索天气 */
  weather: function (e) {
    let that = this
    let cid = e.currentTarget.dataset.cid
    let location = e.currentTarget.dataset.location
    if (cid == '') return
    //  存储搜索的城市数据
    that.setLocationData({cid, location})
  },

  openConfirm: function () {
    let that = this
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
    let that = this
    let keyword = that.data.keyword
    let locationList = that.data.locationList
    let firstcity = ''
    if (locationList != '' && locationList.length > 0) {
      firstcity = locationList[0]
    }
    if (keyword == '' || firstcity == '') return
    firstcity = {
      'location': firstcity.location,
      'cid': firstcity.cid
    }
    // 存储城市数据
    that.setLocationData(firstcity)
  },

  /* 清空关键词 */
  clearkeyword: function () {
    let that = this
    that.setData({
      keyword: '',
      clearIcon: '',
      locationList: '',
      cityTip: '',
      loading: false
    })
  },

  /* 检测输入框变化 */
  inputkeyword: function (e) {
    let that = this
    that.setData({
      keyword: e.detail.value.trim()
    })
    if (e.detail.value.trim().length == 0) {
      that.setData({
        clearIcon: '',
        loading: false,
        locationList: ''
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
              locationList: res.data.HeWeather6[0].basic,
              cityTip: ''
            })
          } else {
            that.setData({
              locationList: [],
              cityTip: '未找到相关城市'
            })
          }
        },
        fail: function () {
          that.setData({
            locationList: [],
            cityTip: '大概是网络故障'
          })
        }
      })
    }
  },

  onShareAppMessage: function () {
    return {
      title: '我在' + this.data.currentLocation.location + '(可能不太准)',
      imageUrl: ''
    }
  }

})