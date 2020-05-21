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
    backgroundColor: app.color.backgroundColor,
    currentColors: colors[0].colors,
    tidx: 0,
    cidx: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
  },

  /* 点击标签 */
  onClickTab: function (e) {
    let id = e.currentTarget.id
    this.setData({
      tidx: id,
      currentColors: colors[id].colors
    })
  },

  /* 点击颜色项 */
  onClickColorItem: function (e) {
    let id = e.currentTarget.id
    let current = this.data.cidx
    if (current === '' || current !== id) {
      current = id
    } else {
      current = ''
    }
    this.setData({
      cidx: current
    })
  },

  /* 设置主题色 */
  onClickColorBtn: function (e) {
    let primaryColor = e.currentTarget.dataset.primaryColor
    let primaryName = e.currentTarget.dataset.primaryName
    let backgroundColor = e.currentTarget.dataset.backgroundColor
    this.toSet(primaryColor, primaryName, backgroundColor)
  },

  /* 设置主题色 */
  toSet: function (primaryColor, primaryName, backgroundColor) {
    this.setData({
      primaryColor: primaryColor,
      backgroundColor: backgroundColor
    })
    app.color.primaryColor = primaryColor
    app.color.backgroundColor = backgroundColor
    app.color.primaryName = primaryName
    wx.setStorage({
      key: 'colorSet',
      data: {
        primaryName,
        primaryColor,
        backgroundColor
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