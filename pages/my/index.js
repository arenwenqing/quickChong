// pages/my/index.js
import { url } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifLogin: wx.getStorageSync('ticket') ? true : false,
    userData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.request({
      url: url + '/api/user/profile',
      method: 'GET',
      data: {
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        console.log(res)
        this.setData({
          userData: res.data.data
        })
      },
      fail: (err) => {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  // 帮助中心
  goHelpCenter() {
    wx.navigateTo({
      url: '/pages/help/index',
    })
  },

  // 意见反馈
  feedback() {
    wx.navigateTo({
      url: '/pages/feedback/index',
    })
  },

  // 我要合作
  cooperateHandle() {
    wx.navigateTo({
      url: '/pages/cooperate/index',
    })
  },

  contributeHandle() {
    wx.navigateTo({
      url: '/pages/contribute/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})