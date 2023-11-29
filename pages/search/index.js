// pages/search/index.js
import { url, QQMapWX, amapFile } from '../../utils/util'
const app = getApp()
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
    currentValue: '',
    option1: [
      { text: '全部', value: '' },
      { text: '充电桩', value: '充电桩' },
      { text: '换电柜', value: '换电柜' },
      { text: '充电柜', value: '充电柜' }
    ],
    value1: '',
    currentPosition: '',
    latitude: '',
    longitude: '',
    resultData: [],
    show: false,
    searchParam: {
      page: 1,
      value: '',
      isLoadMore: true
    },
    oldMessage: {
      text: '',
      position: {}
    }
  },

  // 查看详情
  detailHandle(e) {
    const tempObj = e.currentTarget.dataset.item
    const latitude = tempObj.coordinate.split(',')[0]
    const longitude = tempObj.coordinate.split(',')[1]
    wx.setStorageSync('detailObj', JSON.stringify({
      id: tempObj.id,
      latitude,
      longitude
    }))
    wx.switchTab({
      url: `/pages/index/index?id=${tempObj.id}&&latitude=${latitude}&&longitude=${longitude}`,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    QQMapWX.reverseGeocoder({
      location: {
        latitude: options?.latitude * 1,
        longitude: options?.longitude * 1
      },
      success: (res) => {
        this.setData({
          currentPosition: res.result.formatted_addresses.recommend,
          latitude: options?.latitude * 1,
          longitude: options?.longitude * 1,
          oldMessage: {
            text: res.result.formatted_addresses.recommend,
            position: {
              latitude: options?.latitude * 1,
              longitude: options?.longitude * 1,
            }
          }
        })
      },
      fail: err => {
        console.error(err)
      }
    })
  },

  // 地址搜索
  onSearch(e) {
    if (!e.detail.trim()) return
    this.setData({
      resultData: [],
      searchParam: {
        page: 1,
        value: e.detail && e.detail.trim(),
        isLoadMore: true
      }
    }, () => {
      this.searchRequest()
    })
  },

  // 搜索请求
  searchRequest() {
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/suggestion',
      method: 'GET',
      data: {
        key: '2IQBZ-GCWLL-DSGPF-EJPAM-5HDEV-ILB4O',
        keyword: `${this.data.searchParam.value}`,
        region: app.globalData.address,
        page_index:  this.data.searchParam.page,
        region_fix: 1,
        get_subpois: 1,
        page_size: 20,
        policy: 1,
        location: `${this.data.latitude},${this.data.longitude}`
      },
      success: (res) => {
        this.setData({
          resultData: this.data.resultData.concat(res.data.data || []),
          show: true,
          searchParam: {
            ...this.data.searchParam,
            isLoadMore: res.data.data.length === 20
          }
        })
      },
      fail: (err) => {
        console.error(err)
      },
      complete: () => {
        this.setData({
          addressLoading: false
        })
      }
    })
  },

  // 加载更多
  loadMore() {
    if (!this.data.searchParam.isLoadMore) return
    this.setData({
      searchParam: {
        ...this.data.searchParam,
        page: this.data.searchParam.page + 1,
        isLoadMore: true
      }
    }, () => {
      this.searchRequest()
    })
  },

  // 附近设备
  searchVicinity(e) {
    const tempObj = e.currentTarget.dataset.item
    console.log(tempObj)
    wx.setStorageSync('currentPosition', JSON.stringify({
      latitude: tempObj.location.lat,
      longitude: tempObj.location.lng
    }))
    this.setData({
      show: false,
      currentPage: 1,
      searchData: [],
      currentPosition: tempObj.title,
      ifLoadMore: true
    }, () => {
      this.getDeviceList(this.data.currentValue)
    })
  },

  // 重新定位
  resetPosition() {
    wx.setStorageSync('currentPosition', JSON.stringify(this.data.oldMessage.position))
    this.setData({
      currentPage: 1,
      searchData: [],
      currentPosition: this.data.oldMessage.text,
      ifLoadMore: true
    }, () => {
      this.getDeviceList(this.data.currentValue)
    })
  },

  onClose() {
    this.setData({
      show: false
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

  // choiceType: function (e) {
  //   const index = e.currentTarget.dataset.index
  //   const currentName = this.data.chargeBtnArray.find(item => item.id === e.currentTarget.dataset.index)
  //   this.setData({
  //     choiceTypeValue: e.currentTarget.dataset.index,
  //     searchData: [],
  //     currentPage: 1,
  //     currentValue: index === 1 ? '' : currentName.name
  //   })
  //   this.getDeviceList(index === 1 ? '' : currentName.name )
  // },

  menuChange(value) {
    this.setData({
      // choiceTypeValue: e.currentTarget.dataset.index,
      searchData: [],
      currentPage: 1,
      currentValue: value.detail
    })
    this.getDeviceList(value.detail)
  },

  // showChargeType() {
  //   this.setData({
  //     showMoreType: !this.data.showMoreType
  //   })
  // },

  backHome() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  // 获取用户所在位置附近的设备列表
  getDeviceList(type) {
    const currentPosition = JSON.parse(wx.getStorageSync('currentPosition') || '{}')
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url + '/api/device/dataList',
      method: 'GET',
      data: {
        city: app.globalData.address,
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
          currentPage: (this.data.currentPage * 1) + 1,
          ifLoadMore: data.length === 20
        })
      },
      fail: (err) => {
        console.error(err)
      },
      complete: () => {
        wx.hideLoading()
      }
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

  // 去这里
  goHere(e) {
    const tempObj = e.currentTarget.dataset.item
    wx.openLocation({
      latitude: tempObj.coordinate.split(',')[0] * 1, // 目的地纬度
      longitude: tempObj.coordinate.split(',')[1] * 1, // 目的地经度
      name: tempObj.name, // 目的地名称
      address: tempObj.address, // 目的地地址
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