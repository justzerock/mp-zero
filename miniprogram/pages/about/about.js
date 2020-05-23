// pages/about/about.js
const config = require('../../libs/config.js')
const avatarUrl = config.avatar.link
const app = getApp()
const yearPassed = app.getProgress()
const dayPercent = app.setDaynight()
let that
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: avatarUrl,
    leftText: yearPassed > 50 ? '本年还剩下 👉' : yearPassed + '%',
    rightText: yearPassed <= 50 ? '👈 本年度已过去 ' : (100 - yearPassed).toFixed(1) + '%',
    leftPercent: yearPassed + '%',
    rightPercent: (100 - yearPassed).toFixed(1) + '%',
    dayPercent: dayPercent + '%',
    nightPercent: (100 - dayPercent).toFixed(1) + '%',
    isYear: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    that = this
  },

  /* 跳转页面 */
  navigateTo: (e) => {
    let id = e.currentTarget.id
    wx.navigateTo({
      url: '../' + id + '/' + id,
    });
  },

  /* 跳转页面 */
  switchTab: (e) => {
    let id = e.currentTarget.id
    wx.switchTab({
      url: '../' + id + '/' + id,
    });
  },

  onClickYearPercent: () => {
    let isYear = that.data.isYear
    if (isYear) {
      that.setData({
        leftText: '往者不可谏',
        rightText: '来者犹可追',
        leftPercent: dayPercent + '%',
        rightPercent: (100 - dayPercent).toFixed(1) + '%',
        isYear: false
      })
    } else {
      that.setData({
        leftText: yearPassed > 50 ? '本年还剩下 👉' : yearPassed + '%',
        rightText: yearPassed <= 50 ? '👈 本年度已过去 ' : (100 - yearPassed).toFixed(1) + '%',
        leftPercent: yearPassed + '%',
        rightPercent: (100 - yearPassed).toFixed(1) + '%',
        isYear: true
      })
    }
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