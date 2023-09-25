// pages/startNavigation/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '116.397474',
    latitude: '39.908692',
    markers: [{
      id: 1,
      latitude: 23.099994,
      longitude: 113.324520,
      name: 'T.I.T 创意园',
      width: 30, // 标记点图标宽度
      height: 40 // 标记点图标高度
    }],
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
    this.mapCtx = wx.createMapContext('navigationMap')
    mapCtx.includePoints({
      points: [
        { latitude: 39.908692, longitude: 116.397474 },
        { latitude: 39.914285, longitude: 116.403857 }
      ]
    })
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

  }
})