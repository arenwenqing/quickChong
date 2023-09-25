// pages/cooperate/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cooperateTypeData: [{
      name: '个人',
      id: 0
    }, {
      name: '公司',
      id: 1
    }],
    choiceDeviceValue: -1,
    companyGuimoIndex: -1,
    companyGuiMoData: [{
      name: '0-100人',
      id: 0
    }, {
      name: '100-500人',
      id: 1
    }, {
      name: '500人以上',
      id: 2
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  choiceDeviceType(e) {
    this.setData({
      choiceDeviceValue: e.currentTarget.dataset.index
    })
  },

  companyGuimoHandle(e) {
    this.setData({
      companyGuimoIndex: e.currentTarget.dataset.index
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})