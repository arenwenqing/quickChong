// pages/chargeDevice/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '充电桩', value: 1 },
      { text: '换电柜', value: 2 },
      { text: '充电柜', value: 3 },
    ],
    value1: 1,
    value: undefined,
    chargeDeviceData: new Array(10).fill(1)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      value1: options.type * 1
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  onChange(e) {
    this.setData({
      value: e.detail,
    });
  },

  searchValue: function() {
    console.log(this.data.value)
  },

  // 前往
  goCharge: function() {
    wx.switchTab({
      url: `/pages/index/index?latitude=116.397474&latitude=39.908692`,
    })
  }
})