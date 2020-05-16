var config = require('../../libs/config.js');
var colors = config.colors;
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tcColors: '',
    showTi: false,
    dispArr: [],
    dispTi: [],
    anim: {},
    state: -1,
    primaryName: '黛绿',
    primaryColor: '#426666',
    backgroundColor: '#f6f7f7',
    colorHei: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var arr = []
    var ti = []
    for (let i in colors) {
      arr.push(false)
      ti.push('show')
    }
    that.getPosition(arr)
    that.setData({
      tcColors: colors,
      dispArr: arr,
      dispTi: ti,
      primaryColor: app.color.primaryColor,
      backgroundColor: app.color.backgroundColor,
      primaryName: app.color.primaryName
    })
  },

  getPosition: function (arr) {
    var that = this
    var devHei = 0
    var colorHei = 0
    wx.getSystemInfo({
      success: (res) => {
        devHei = res.windowHeight
      }
    });
    colorHei = devHei / arr.length
    /* colorHei = platform == 'ios' ?
      (devHei - 50) / arr.length :
      devHei / arr.length */
    that.setData({
      colorHei: colorHei
    })
  },

  copyColor: function (e) {
    var that = this
    var value = e.currentTarget.dataset.theColor
    wx.setClipboardData({
      data: value,
      success: function () {
        wx.showToast({
          title: '复制：' + value
        })
      }
    })
  },

  setColors: function (e) {
    var that = this
    var colorArr = e.currentTarget.dataset.colorValue.split(',')
    var primaryName = that.data.primaryName
    if (primaryName === colorArr[0]) return
    var primaryColor = ''
    var backgroundColor = ''
    primaryColor = colorArr[1]
    backgroundColor = colorArr[2]
    that.toSet(primaryColor, backgroundColor, colorArr[0])
    that.setData({
      primaryName: colorArr[0],
    })
  },

  toSet: function (primaryColor, backgroundColor, primaryName) {
    wx.setStorage({
      key: 'colorSet',
      data: {
        primaryColor: primaryColor,
        backgroundColor: backgroundColor,
        primaryName: primaryName
      }
    })
    app.color.primaryColor = primaryColor
    app.color.backgroundColor = backgroundColor
    app.color.primaryName = primaryName
    this.setData({
      primaryColor: primaryColor,
      backgroundColor: backgroundColor
    })
  },

  showAction: function (e) {
    var that = this
    var state = that.data.state
    var index = e.currentTarget.dataset.index
    state = state == index ? -1 : index
    that.setData({
      state: state
    })
  },

  itemToggle: function (e) {
    var that = this
    var sid = e.currentTarget.dataset.sid
    var dispArr = that.data.dispArr
    var dispTi = that.data.dispTi
    dispArr[sid] = !dispArr[sid]
    for (let i in dispTi) {
      if (i == sid) {
        dispTi[i] = dispArr[sid] ? 'fixed' : 'show'
      } else {
        dispTi[i] = dispArr[sid] ? 'hidden' : 'show'
      }
    }
    that.setData({
      dispArr: dispArr,
      dispTi: dispTi,
      state: -1
    })
    var color = dispArr[sid] ? that.data.tcColors[sid].color : that.data.tcColors[0].color
    var time = dispArr[sid] ? 300 : 0
    setTimeout(function () {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: color
      })
    }, time)

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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

  }
})