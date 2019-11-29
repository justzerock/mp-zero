var config = require('../../libs/config.js');
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    baike: '百度百科',
    searchTip: '输入关键字',
    btnSearch: '查询',
    keyword: '', //  关键词
    result: '', //  结果
    resultImg: '', //  图片结果
    imgWidth: '360', //  图片宽度
    tip: '', //  提示
    tipIcon: '', //  提示图标
    clearIcon: false, //  清空关键词图标
    baikeHistory: '',  //  历史关键词缓存
    showHis: true, //  是否显示历史
    loading: false,  //  是否显示加载动画
    headup: false,  //  上调头部
    focus: false, //  聚焦
    typing: false, //  打字效果
    primaryColor: '',
    backgroundColor: '',
    current: '',
    set: true
    
  },

  /**
 * 生命周期函数--监听页面加载
 */
  onLoad: function (options) {
    wx.hideTabBar()    
    var that = this
    that.setColors()
    that.getHistory()
  },

  onShow: function () {  
    var that = this
    that.setColors()

  },

  /* 设置主题色 */
  setColors: function () {
    var primaryColor = app.color.primaryColor
    var backgroundColor = app.color.backgroundColor
    var set = config.shadeColor(primaryColor)
    this.setData({
      primaryColor: primaryColor,
      backgroundColor: backgroundColor,
      current: 'baike',
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

  /* 搜索关键词 */
  onSearch: function () {
    var that = this
    var keyword = that.data.keyword
    if (keyword.length == 0) return
    else if (keyword == that.data.result.key) return
    that.setData({
      result: '',
      resultImg: '',
      tip: '',
      showHis: false,
      loading: true,
      headup: true
    })
    that.setHistory(keyword)
    wx.request({
      url: 'https://baike.baidu.com/api/openapi/BaikeLemmaCardApi?scope=103&format=json&appid=379020&bk_length=600',
      data: {
        bk_key: that.data.keyword
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (typeof res.data.abstract != "undefined") {
          that.setData({
            result: res.data
          })
          if (typeof res.data.image != "undefined") {
            var img = []
            img.push(res.data.image)
            that.setData({
              resultImg: img
            })
          } else {
            that.setData({
              resultImg: ''
            })
          }

        } else if (res.data.errno == "2") {
          that.onSearch()
        } else {
          that.setData({
            tip: '无结果……，换个关键词吧',
            tipIcon: 'icon-frown'
          })
        }
      },
      fail: function () {
        that.setData({
          tip: '也许，是网络出故障了？',
          tipIcon: 'icon-sweat'
        })
      },
      complete: function () {
        setTimeout(function () {
          that.setData({
            loading: false
          })
        }, 1000);
      }

    })
  },

  /* 聚焦事件 */
  focus: function () {
    var that = this
    that.setData({
      focus: true,
      headup: true
    })
    var keyword = that.data.keyword
    if (keyword.trim() != '') {
      that.setData({
        showHis: false,
        clearIcon: true
      })
    }
  },

  /* 失焦事件 */
  blur: function () {
    var that = this
    var keyword = that.data.keyword
    var result = that.data.result
    that.setData({
      focus: false
    })
    if (keyword == '' && result == '') {
      that.setData({
        headup: false,
        tip: '',
        showHis: true
      })
    }
  },

  /* 设置关键词缓存 */
  setHistory: function (keyword) {
    var that = this
    that.getHistory()
    var history = that.data.baikeHistory
    if (history != '') {
      var flags = true
      for (let i in history) {
        if (history[i] == keyword) {
          flags = false
        }
      }
      if (flags) {
        history.push(keyword)
        if (history.length > 12) {
          history.splice(0, 1)
        }
      }
      try {
        wx.setStorageSync('baikeHistory', history)
      } catch (e) {
      }
    } else {
      history = []
      history.push(keyword)
      try {
        wx.setStorageSync('baikeHistory', history)
      } catch (e) {
      }
    }
    that.setData({
      baikeHistory: history
    })
  },

  /* 获取缓存 */
  getHistory: function () {
    var that = this
    try {
      var value = wx.getStorageSync('baikeHistory')
      if (value != '') {
        that.setData({
          baikeHistory: value
        })
      }
    } catch (e) {
    }
  },

  /* 预览图 */
  previewImg: function (e) {
    var that = this
    wx.previewImage({
      current: '',
      urls: that.data.resultImg
    })
  },

  /* 搜索选中历史关键词 */
  searchThis: function (e) {
    var that = this
    var keyword = e.currentTarget.dataset.name
    keyword = keyword.replace(/<\/?[^>]*>/g, '')
    keyword = keyword.replace(/&nbsp;/ig, '')
    that.setData({
      keyword: keyword,
      clearIcon: true
    })
    that.onSearch()
  },

  /* 删除选中历史纪录 */
  deleteThis: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.getHistory()
    var history = that.data.baikeHistory
    history.splice(index, 1)
    try {
      wx.setStorageSync('baikeHistory', history)
    } catch (e) {
    }
    that.setData({
      baikeHistory: history
    })
  },

  /* 删除所有历史记录 */
  deleteAll: function () {
    var that = this
    wx.removeStorage({
      key: 'baikeHistory',
      success: function (res) {
        that.setData({
          baikeHistory: ''
        })
      },
    })
  },

  /* 监测输入框 */
  inputkeyword: function (e) {
    var that = this
    var keyword = e.detail.value
    that.setData({
      clearIcon: true,
      keyword: keyword,
      showHis: false
    })
    if (keyword.length == 0) {
      that.setData({
        clearIcon: false,
        tip: ''
      })
    }
  },

  /* 清空关键词 */
  clearkeyword: function () {
    var that = this
    that.setData({
      keyword: '',
      clearIcon: false,
      tip: '',
      loading: false
    })
  },

  /* 返回主页 */
  backHome: function () {
    var that = this
    that.setData({
      keyword: '',
      clearIcon: false,
      result: '',
      resultImg: '',
      tip: '',
      showHis: true,
      loading: false,
      headup: false
    })
  },

})