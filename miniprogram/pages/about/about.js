// pages/about/about.js
const config = require('../../libs/config.js')
const avatarUrl = config.avatar.link
const app = getApp()
const yearPassed = app.getProgress()
const dayPercent = app.setDaynight()
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
    nightPercent: (100 - dayPercent).toFixed(1) + '%'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.setNavigationBarColor({
      backgroundColor: '#fff',
      frontColor: '#000000',
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