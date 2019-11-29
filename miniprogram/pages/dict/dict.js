var config = require('../../libs/config.js');
var dailyLink = config.daily.link;
var interval; //  历史记录效果
var app = getApp()
Page({
  data: {
    keyword: '', // 关键字
    focus: false, // 聚焦类名
    headup: false, //  设置输入框位置
    loading: false, //  加载动画
    clearIcon: false, //  清空图标
    tip: '', //  提示语
    showHis: true, //  显示历史
    suggest: '', //  单词联想
    resWord: '', //  单词翻译结果
    dictHistory: '', //  搜索历史
    showSug: false, //  显示联想
    primaryColor: '',
    backgroundColor: '',
    current: '',
    set: true
  },
  onLoad: function () {
    wx.hideTabBar()    
    var that = this
    that.setColors()
    that.getDictHistory()
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
      current: 'dict',
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

  /* 获取单词联想, 6条 */
  getsuggest: function (keyword) {
    var that = this
    wx.request({
      url: 'https://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&client=6&is_need_mean=1',
      data: {
        //nums:6,
        word: keyword
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 1) {
          that.setData({
            suggest: res.data.message,
            tip: ''
          })
        } else {
          that.setData({
            suggest: '',
            tip: '无结果'
          })
        }
      }
    })
  },

  /* 聚焦事件 */
  focus: function () {
    var that = this
    that.setData({
      focus: true,
      headup: true,
      showSug: true
    })
    var keyword = that.data.keyword
    if (keyword.trim() != '') {
      that.setData({
        loading: true,
        showHis: false,
        clearIcon: true
      })
    }
  },

  /* 失焦事件 */
  blur: function () {
    var that = this
    var keyword = that.data.keyword
    var resWord = that.data.resWord
    that.setData({
      focus: false,
      loading: false
    })
    if (keyword == '' && resWord == '') {
      that.setData({
        headup: false,
        suggest: '',
        tip: '',
        showHis: true,
        showSug: false
      })
    }
  },

  /* 检测输入框变化 */
  inputkeyword: function (e) {
    var that = this
    var keyword = e.detail.value
    that.setData({
      clearIcon: true,
      keyword: keyword,
      loading: true,
      showHis: false,
      showSug: true
    })
    if (keyword.length == 0) {
      that.setData({
        clearIcon: false,
        tip: '',
        suggest: '',
        loading: false
      })
    } else {
      that.getsuggest(keyword)
    }
  },

  /* 清空关键词 */
  clearkeyword: function () {
    var that = this
    that.setData({
      keyword: '',
      tip: '',
      suggest: '',
      clearIcon: false,
      loading: false,
      showSug: false
    })
  },

  /* 返回主页 */
  backHome: function () {
    var that = this
    that.setData({
      keyword: '',
      tip: '',
      suggest: '',
      resWord: '',
      clearIcon: false,
      headup: false,
      showHis: true,
      loading: false,
      showSug: false
    })
  },

  /* 删除单个历史记录 */
  deleteThis: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.getDictHistory()
    var history = that.data.dictHistory
    history.splice(index, 1)
    try {
      wx.setStorageSync('dictHistory', history)
    } catch (e) { }
    that.setData({
      dictHistory: history
    })
  },

  /* 删除所有历史纪录 */
  deleteAll: function () {
    var that = this
    wx.removeStorage({
      key: 'dictHistory',
      success: function (res) {
        that.setData({
          dictHistory: ''
        })
      },
    })
  },

  /* 搜索关键词句 */
  onSearch: function (e) {
    var that = this
    var keyword = that.data.keyword
    var suggest = that.data.suggest
    if (suggest == '') return
    var index = e.currentTarget.dataset.searchIndex
    var result = suggest[0]
    var history = suggest[0].key
    if (index == '-1') {
      for (let i in suggest) {
        if (suggest[i].key == keyword) {
          result = suggest[i]
          history = suggest[i].key
        }
      }
    } else {
      result = suggest[index]
      history = suggest[index].key
    }
    that.setData({
      resWord: result,
      loading: false,
      showSug: false
    })
    that.setDictHistory(history)
  },

  /* 搜索选中的记录 */
  searchThis: function (e) {
    var that = this
    var keyword = e.currentTarget.dataset.name
    var suggest = ''
    var result = ''
    var word = keyword.split(' ')
    wx.request({
      url: 'https://dict-mobile.iciba.com/interface/index.php?c=word&m=getsuggest&client=6&is_need_mean=1',
      data: {
        word: word[0]
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.status == 1) {
          suggest = res.data.message
          for (let i in suggest) {
            if (suggest[i].key == keyword) {
              result = suggest[i]
            }
          }
        } else {
          result = {
            'key': keyword,
            'means': [{
              'means': ['无翻译结果……']
            }]
          }
        }
        that.setData({
          resWord: result,
          keyword: keyword,
          headup: true
        })
      }
    })
  },

  /* 存储搜索记录 */
  setDictHistory: function (keyword) {
    var that = this
    that.getDictHistory()
    var history = that.data.dictHistory
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
        wx.setStorageSync('dictHistory', history)
      } catch (e) { }
    } else {
      history = []
      history.push(keyword)
      try {
        wx.setStorageSync('dictHistory', history)
      } catch (e) { }
    }
    that.setData({
      dictHistory: history
    })
  },

  /* 获取搜索记录 */
  getDictHistory: function () {
    var that = this
    try {
      var history = wx.getStorageSync('dictHistory')
      if (history != '') {
        that.setData({
          dictHistory: history
        })
      }
    } catch (e) { }
  },

})