// pages/cooperate/index.js
import { url } from '../../utils/util'
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
    company_name: '',
    contact: '',
    phone: '',
    email: '',
    intro: ''
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

  // 提交合作
  submitCooperate() {
    const companySize = this.data.companyGuiMoData.find(item => item.id === this.data.companyGuimoIndex) || {}
    wx.request({
      url: url + '/api/user/cooperate',
      method: 'POST',
      data: {
        ticket: wx.getStorageSync('ticket'),
        type: this.data.choiceDeviceValue === 0 ? '个人' : '公司' ,
        company_size: companySize.name,
        company_name: this.data.company_name,
        contact: this.data.contact,
        phone: this.data.phone,
        email: this.data.email,
        intro: this.data.intro
      },
      success: (res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1 // 返回上一级页面
            })
          }, 1000)
        }
      },
      fail: (err) => {
        console.error('提交合作失败：', err)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})