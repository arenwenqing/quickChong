// pages/search/index.js
import { url } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chargeBtnArray: [{
      name: '全部',
      id: 1,
      selectIcon: '',
      icon: ''
    }, {
      name: '充电桩',
      selectIcon: '/image/chongdianzhuang-select-icon.png',
      icon: '/image/chongdianzhuang-icon.png',
      id: 2
    }, {
      name: '换电柜',
      selectIcon: '/image/huandiangui-select-icon.png',
      icon: '/image/huandiangui-icon.png',
      id: 3
    }, {
      name: '充电柜',
      selectIcon: '/image/chongdiangui-select-icon.png',
      icon: '/image/chongdiangui-select.png',
      id: 4
    }],
    showMoreType: false,
    choiceTypeValue: 1,
    searchData: [],
    currentPage: 1,
    ifLoadMore: true,
    currentValue: ''
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
    this.getDeviceList('')
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

  choiceType: function (e) {
    const index = e.currentTarget.dataset.index
    const currentName = this.data.chargeBtnArray.find(item => item.id === e.currentTarget.dataset.index)
    this.setData({
      choiceTypeValue: e.currentTarget.dataset.index,
      searchData: [],
      currentPage: 1,
      currentValue: index === 1 ? '' : currentName.name
    })
    this.getDeviceList(index === 1 ? '' : currentName.name )
  },

  showChargeType() {
    this.setData({
      showMoreType: !this.data.showMoreType
    })
  },

  backHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 获取用户所在位置附近的设备列表
  getDeviceList(type) {
    const currentPosition = JSON.parse(wx.getStorageSync('currentPosition') || '{}')
    wx.request({
      url: url + '/api/device/nearbyList',
      method: 'GET',
      data: {
        city: '北京市',
        device_type: type,
        coordinate: `${currentPosition.latitude},${currentPosition.longitude}`,
        page: this.data.currentPage,
        size: 20,
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        const data = res.data.data?.list || []
        this.setData({
          searchData: this.data.searchData.concat(data),
          currentPage: (res.data.data.page * 1) + 1,
          ifLoadMore: data.length === 20
        })
      },
      fail: (err) => {
        console.error(err)
      },
    })
  },

  // 添加地址时滚动到底部加载
  scrollToLower() {
    console.log('滚动到底部了')
    if (this.data.ifLoadMore) {
      this.getDeviceList(this.data.currentValue)
    }
  },

  // 评论详情
  showCommentDetail(e) {
    wx.navigateTo({
      url: `/pages/comment/index?id=${e.currentTarget.dataset.id}`,
    })
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