const config = require('../../libs/config.js');
const colors = config.colors;
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeColors: colors,
    primaryColor: app.color.primaryColor,
    currentColors: colors[app.color.tabIndex].colors,
    tabIndex: app.color.tabIndex,
    colorIndex: '5#549688'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.setData({
      primaryColor: app.color.primaryColor,
      tabIndex: app.color.tabIndex,
      colorIndex: app.color.colorIndex,
      currentColors: colors[app.color.tabIndex].colors
    })
  },

  /* 点击标签 */
  onClickTab: function (e) {
    let id = e.currentTarget.id
    this.setData({
      tabIndex: id,
      currentColors: colors[id].colors
    })
  },

  /* 点击颜色项 */
  onClickColorItem: function (e) {
    let id = e.currentTarget.id
    let current = this.data.colorIndex
    if (current === '' || current !== id) {
      current = id
    } else {
      current = ''
    }
    this.setData({
      colorIndex: current
    })
  },

  /* 设置主题色 */
  onClickColorBtn: function (e) {
    let primaryColor = e.currentTarget.dataset.primaryColor
    let primaryName = e.currentTarget.dataset.primaryName
    let backgroundColor = e.currentTarget.dataset.backgroundColor
    let tabIndex = this.data.tabIndex
    let colorIndex = this.data.colorIndex
    this.setData({
      primaryColor: primaryColor
    })
    app.color.primaryColor = primaryColor
    app.color.backgroundColor = backgroundColor
    app.color.primaryName = primaryName
    app.color.tabIndex = tabIndex
    app.color.colorIndex = colorIndex
    wx.setStorage({
      key: 'colorSet',
      data: {
        primaryName,
        primaryColor,
        backgroundColor,
        tabIndex,
        colorIndex
      }
    })
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