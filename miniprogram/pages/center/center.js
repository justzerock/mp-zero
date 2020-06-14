const app = getApp()
const db = wx.cloud.database()
const dbLike = db.collection('user-like')
const config = require('../../libs/config.js');
const avatarUrl = config.avatar.link;
const yearPassed = app.getProgress()
const dayPercent = app.setDaynight()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: avatarUrl,
    nickName: '👈 知晴否',
    logged: false,
    settingItems: [
      {
        name: '主题色',
        value: 'Color',
        icon: 'colors'
      },
      {
        name: '喜欢吗',
        value: 'Like',
        icon: 'likeo'
      },
      {
        name: '联系我',
        value: 'Mail',
        icon: 'mail'
      },
      {
        name: '清空吧',
        value: 'Clean',
        icon: 'clean'
      },
      {
        name: '关于它',
        value: 'About',
        icon: 'about'
      }
    ],
    leftPercent: '0%',
    leftText: '',
    rightText: '',
    primaryColor: '#549688',
    backgroundColor: '#f6faf9',
    colorName: '铜绿',
    usedSize: 0,
    likeCount: 0,
    like: false,
    likeData: [],
    openid: '',
    current: '',
    words: false,
    hasHomeBar: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () { 
    wx.hideTabBar()
    that = this
    that.setColors()
    that.setSettingDetail()
    that.getLikeCount()
    //that.getUserInfo()
    setTimeout(function () {
      that.setYearPassed()
    }, 500)
  },

  // 获取用户信息
  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userInfo: e.detail.userInfo
      })
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo
      })
      wx.setStorage({
        key: 'logged',
        data: true
      })
    }
  },

  // 从storage读取
  getUserInfo: function () {
    wx.getStorage({
      key: 'logged',
      success (res) {
        if (res.data) {
          that.setData({
            logged: res.data
          })
          wx.getStorage({
            key: 'userInfo',
            success (res) {
              that.setData({
                userInfo: res.data
              })
            }
          })
        }
      }
    })
  },

  /* 设置主题色 */
  setColors: function () {
    let primaryColor = app.color.primaryColor
    let backgroundColor = app.color.backgroundColor
    let primaryName = app.color.primaryName
    this.setData({
      primaryColor: primaryColor,
      backgroundColor: backgroundColor,
      primaryName: primaryName,
      current: 'center'
    })
    
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: primaryColor,
    })

  },

  /* 获取点赞数量 */
  getLikeCount: function () {
    dbLike.where({
      like: true
    }).count().then(res => {
      that.setData({
        likeCount: res.total
      })
    })
    dbLike.where({
      _openid: app.globalData.openid
    }).get().then(res => {
      if (res.data.length != 0) {
        that.setData({
          likeData: res.data,
          like: res.data[0].like
        })
      }
    })
  },

  /* 点击设置项目 */
  setItemColor: function () {
    wx.navigateTo({
      url: '../colors/colors',
    })
  },

  /* 点击设置项目 */
  setItemLike: function () {
    let like = that.data.like
    let likeCount = that.data.likeCount
    let likeData = that.data.likeData
    like = !like
    if (like && likeData.length == 0) {
      dbLike.add({
        // data 字段表示需新增的 JSON 数据
        data: {
          like: true
        }
      })
        .then(res => {
          console.log(res)
        })
        .catch(console.error)
    } else {
      dbLike.doc(likeData[0]._id).update({
        data: {
          like: like
        }
      })
        .then(console.log)
        .catch(console.error)
    } 
    likeCount = like? likeCount+1 : likeCount-1
    that.setData({
      like: like,
      likeCount: likeCount
    })
  },

  /* 点击设置项目 */
  setItemMail: function () {
    wx.setClipboardData({
      data: 'liu.zerock@gmail.com',
      success: function () {
        wx.showToast({
          title: '邮箱已复制'
        })
      }
    })
  },

  /* 点击设置项目 */
  setItemClean: function () {
    wx.showModal({
      title: '确定清空？',
      content: '此操作将会删除天气及搜索历史，以及恢复默认配色',
      success(res) {
        if (res.confirm) {
          wx.clearStorage()
          that.setSettingDetail()
        } else if (res.cancel) {
        }
      }
    })
  },

  /* 关于 */
  setItemAbout: function () {
    wx.navigateTo({
      url: '../about/about',
    })
  },

  /* 设置年进度 */
  setYearPassed: function () {
    let leftText
    let rightText
    if (yearPassed < 50) {
      leftText = yearPassed + '%'
      rightText = '👈 本年度已过去 '
    } else {
      leftText = '本年度还剩下 👉'
      rightText = (100-yearPassed).toFixed(1) + '%'
    }
    that.setData({
      leftPercent: yearPassed + '%',
      leftText: leftText,
      rightText: rightText,
      words:false
    })
  },

  showWords: function () {
    let words = that.data.words
    if (words) {
      that.setYearPassed()
    } else {
      that.setData({
        leftPercent: dayPercent + '%',
        leftText: '逝者如斯夫',
        rightText: '不舍昼夜',
        words: true
      })
    }
  },

  /* 设置菜单详情 */
  setSettingDetail: function () {
    wx.getStorageInfo({
      success (res) {
        that.setData({
          usedSize: res.currentSize
        })
      }
    })
    that.setData({
      colorName: app.color.primaryName
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: () => {
    that.setData({
      hasHomeBar: app.hasHomeBar
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideTabBar()
    let that = this
    that.setColors()
    that.setSettingDetail()
    let words = that.data.words
    if (words) return
    this.setData({
      leftPercent: yearPassed + '%'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    let words = this.data.words
    if (words) return
    this.setData({
      leftPercent: yearPassed/2 + '%'
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '往者不可谏，来者犹可追',
      imageUrl: ''
    }
  }
})