// index.js
import { url } from '../../utils/util'
// 获取应用实例
const app = getApp()
Page({
  data: {
    chargeBtnArray: [{
      name: '全部',
      id: 1,
      selectIcon: '',
      icon: '',
      value: ''
    }, {
      name: '充电桩',
      selectIcon: '/image/chongdianzhuang-select-icon.png',
      icon: '/image/chongdianzhuang-icon.png',
      id: 2,
      value: '充电桩'
    }, {
      name: '换电柜',
      selectIcon: '/image/huandiangui-select-icon.png',
      icon: '/image/huandiangui-icon.png',
      id: 3,
      value: '换电柜'
    }, {
      name: '充电柜',
      selectIcon: '/image/chongdiangui-select-icon.png',
      icon: '/image/chongdiangui-select.png',
      id: 4,
      value: '充电柜'
    }],
    markCheckedShow: false,
    choiceTypeValue: 1,
    showMoreType: false,
    latitude: 0,
    longitude: 0,
    markers:[],
    polyline: [],
    show: false,
    currentMarkers: {},
    deviceDetail: {},
    showBigImage: {
      flag: false,
      url: ''
    }
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap')
  },

  // 点击展示大图
  showBig(e) {
    wx.hideTabBar();
    this.setData({
      showBigImage: {
        flag: true,
        url: e.currentTarget.dataset.url
      }
    })
  },

  // 关闭大图
  onCloseMark() {
    this.setData({
      showBigImage: {
        flag: false,
        url: ''
      }
    })
    wx.showTabBar();
  },

  onLoad: function (options) {
    // 先检查用户是否登录
    this.checkSessionHandle()
  },

  // 申请获取位置的操作
  appForLocation () {
    // 先校验用户是否拒绝过
    if (wx.getStorageSync('scope.userLocation') === false) {
      this.checkSetting()
    } else {
      this.getCenterLocation()
    }
  },

  // 检查位置授权情况
  checkSetting () {
    wx.getSetting({
      success: (res) => {
        // 判断是否已经授权地理位置
        if (!res.authSetting['scope.userLocation']) {
          // 没有授权，弹出模态框
          this.showModal()
        } else {
          this.getCenterLocation()
        }
      }
    })
  },

  // 检查登录是否过期
  checkSessionHandle() {
    wx.checkSession({
      success: (res) => {
        this.appForLocation()
      },
      fail: (err) => {
        wx.clearStorageSync()
        this.login()
      }
    })
  },

  // 微信登录
  login() {
    wx.login({
      success: (res) => {
        if (res.code) {
          wx.setStorageSync('code', res.code)
          wx.getUserInfo({
            withCredentials: true,
            success: (suc) =>{
              this.getTicket(suc)
            },
            fail: (err) => {
              console.error('调用getUserInfo接口失败：' + err)
            }
          })
        }
      },
      fail: (err) => {
        console.log('登录失败！' + res.errMsg)
      }
    })
  },

  // 调用后端接口拿ticket
  getTicket(param) {
    wx.request({
      url: url + '/api/user/authorize',
      method: 'POST',
      data: {
        code: wx.getStorageSync('code'),
        encryptedData: param.encryptedData,
        iv: param.iv,
        signature: param.signature,
        rawData: param.rawData
      },
      success: (res) => {
        wx.setStorageSync('ticket', res.data.data.ticket)
        this.appForLocation()
      },
      fail: (err) => {
        console.error('获取ticket失败：', err)
      }
    })
  },

  // 引导用户授权的模态框
  showModal() {
    wx.showModal({
      title: '提示',
      content: '您需要授权地理位置才能使用该功能',
      success: (res) => {
        // 判断用户是否点击确定
        if (res.confirm) {
          // 点击确定，跳转到设置页面
          this.openSetting()
        } else if (res.cancel) {
          // 点击取消，弹出提示框
          this.showToast()
        }
      }
    })
  },

  // 跳转到设置页面
  openSetting () {
    // 调用 wx.openSetting 接口
    wx.openSetting({
      success: (res) => {
        // 判断是否已经授权地理位置
        if (res.authSetting['scope.userLocation']) {
          // 已经授权，重新获取地理位置
          this.getCenterLocation()
        } else {
          // 没有授权，弹出提示框
          this.showToast()
        }
      }
    })
  },

  // 搜索
  toSearch: () => {
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },

  // 弹出提示框
  showToast: () => {
    wx.showToast({
      title: '无法获取地理位置',
      icon: 'none',
      duration: 2000
    })
  },

  getCenterLocation: function () {
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 3500,
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.setStorageSync('currentPosition', JSON.stringify({ latitude, longitude }))
        this.getDeviceList('')
        // 调用移动到用户位置的方法
        // this.mapCtx?.moveToLocation({
        //   latitude: latitude,
        //   longitude: longitude,
        //   success: function () {
        //     // 移动成功
        //   },
        //   fail: function (error) {
        //     // 移动失败，可以处理错误情况
        //     console.error(error);
        //   }
        // });
      },
      fail: (err) => {
        console.error(err)
        wx.setStorageSync('scope.userLocation', false)
      }
    })
    // this.mapCtx.getCenterLocation({
    //   success: function(res){
    //     console.log(res.longitude)
    //     console.log(res.latitude)
    //   }
    // })
  },

  // 点击标记点
  markertap(event) {
    const markerId = event.markerId; // 获取点击的标记点的 id
    const selectedMarker = this.data.markers.find(marker => marker.id === markerId);
    // 在这里可以根据 selectedMarker 执行需要的操作，比如显示信息窗口等
    console.log("点击了标记点：" + selectedMarker.id);
    this.setData({
      markCheckedShow: true
    }, () => {
      this.getDeviceDetail(selectedMarker)
    })
  },

  // 关闭详情
  closeMarkDetail() {
    this.setData({
      markCheckedShow: false
    })
  },

  // 去纠错
  goErrorCorrection(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/errorCorrection/index?id=${id}`,
    })
  },

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  choiceType: function (e) {
    this.setData({
      choiceTypeValue: e.currentTarget.dataset.index
    }, () => {
      const obj = this.data.chargeBtnArray.find(item => item.id === e.currentTarget.dataset.index)
      this.getDeviceList(obj.value)
    })
  },

  // 添加设备
  addDeviceHandle() {
    wx.getSetting({
      success: (res) => {
        // 判断是否已经授权地理位置
        if (!res.authSetting['scope.userLocation']) {
          // 没有授权，弹出模态框
          this.showModal()
        } else {
          wx.navigateTo({
            url: `/pages/addDevice/index`,
          })
        }
      }
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
        page: 1,
        size: 20,
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        const data = res.data.data?.list || []
        const mapIcon = {
          '充电桩': '/image/chongdiangzhuang-map-icon.png',
          '换电柜': '/image/huandiangui-map-icon.png',
          '充电柜': '/image/chongdiangui-map-icon.png'
        }
        const tempMarkers = data.map((item, index) => {
          const coordinate = item.coordinate.split(',')
          return {
            id: item.id * 1,
            latitude: coordinate[0] * 1,
            longitude: coordinate[1] * 1,
            iconPath: mapIcon[item.device_type],
            width: 50, // 标记点图标宽度
            height: 55 // 标记点图标高度
          }
        })
        this.setData({
          markers: tempMarkers
        })
        // 调用移动到用户位置的方法
        this.mapCtx?.moveToLocation({
          latitude: currentPosition.latitude,
          longitude: currentPosition.longitude,
          success: function () {
            // 移动成功
          },
          fail: function (error) {
            // 移动失败，可以处理错误情况
            console.error(error);
          }
        });
      },
      fail: (err) => {
        console.error(err)
      },
    })
  },

  // 获取设备详情
  getDeviceDetail(param) {
    const currentPosion = JSON.parse(wx.getStorageSync('currentPosition') || '{}')
    wx.request({
      url: url + '/api/device/detail',
      method: 'GET',
      data: {
        ticket: wx.getStorageSync('ticket'),
        id: param.id,
        coordinate: `${currentPosion.latitude},${currentPosion.longitude}`
      },
      success: (res) => {
        this.setData({
          deviceDetail: res.data.data
        })
      },
      fail: () => {
        wx.showToast({
          title: '获取设备出错',
          icon: 'fail'
        })
      }
    })
  },

  onShow() {
    if (wx.getStorageSync('ticket')) {
      this.getDeviceList('')
    }
  },

  // 回到当前位置
  goBackCurrentPosition() {
    const currentPosion = JSON.parse(wx.getStorageSync('currentPosition') || {})
    if (!currentPosion.latitude) return
    this.mapCtx.moveToLocation({
      latitude: currentPosion.latitude,
      longitude: currentPosion.longitude,
      success: function () {
        // 移动成功
      },
      fail: function (error) {
        // 移动失败，可以处理错误情况
        console.error(error);
      }
    });
  },

  // 查看评论详情
  lookCommentDetail(e) {
    wx.navigateTo({
      url: `/pages/comment/index?id=${e.currentTarget.dataset.id}`,
    })
  },

  skipChargePage: function() {
    wx.navigateTo({
      url: `/pages/chargeDevice/index?type=${this.data.choiceTypeValue}`,
    })
  },

  // showChargeType() {
  //   this.setData({
  //     showMoreType: !this.data.showMoreType
  //   })
  // },

  // 城市选择
  showAddressChoice() {
    this.setData({
      show: true
    })
  },

  // 路线规划
  goPosition() {
    wx.openLocation({
      latitude: 39.920067,
      longitude: 116.44352
    })
    // const currentPosion = JSON.parse(wx.getStorageSync('currentPosition') || {})
    // wx.request({
    //   url: 'https://apis.map.qq.com/ws/direction/v1/ebicycling/',
    //   method: 'GET',
    //   data: {
    //     key: 'IFIBZ-54CWQ-NLX5T-4FLGB-5WFB3-KEBV2',
    //     from: `${currentPosion.latitude},${currentPosion.longitude}`,
    //     to: `39.920067,116.44352`
    //   },
    //   success: (res) => {
    //     console.log(res.data)
    //     var result = res.data.result
    //     var route = result.routes[0]
    //     var coors = route.polyline, pl = [];
    //     //坐标解压（返回的点串坐标，通过前向差分进行压缩）
    //     var kr = 1000000;
    //     for (var i = 2; i < coors.length; i++) {
    //       coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
    //     }
    //     //将解压后的坐标放入点串数组pl中
    //     for (var i = 0; i < coors.length; i += 2) {
    //       pl.push({ latitude: coors[i], longitude: coors[i + 1] })
    //     }
    //     this.setData({
    //       // 将路线的起点设置为地图中心点
    //       latitude:pl[0].latitude,
    //       longitude:pl[0].longitude,
    //       // 绘制路线
    //       polyline: [{
    //         points: pl,
    //         color: '#58c16c',
    //         width: 6,
    //         borderColor: '#2f693c',
    //         borderWidth: 1
    //       }],
    //       markers: [{
    //         id: 3,
    //         latitude: pl[0].latitude,
    //         longitude: pl[0].longitude,
    //         iconPath: '/image/start-icon.png',
    //         name: 'T.I.T 创意园',
    //         width: 50, // 标记点图标宽度
    //         height: 55 // 标记点图标高度
    //       }, {
    //         id: 4,
    //         latitude: 39.920067,
    //         longitude: 116.44352,
    //         iconPath: '/image/end-icon.png',
    //         name: '终点',
    //         width: 50, // 标记点图标宽度
    //         height: 55 // 标记点图标高度
    //       }]
    //     })
    //   },
    //   fail: (err) => {
    //     console.error(err)
    //   }
    // })
  },

  // 关闭城市选择
  onClose() {
    this.setData({
      show: false
    })
  }

  // translateMarker: function() {
  //   this.mapCtx.translateMarker({
  //     markerId: 1,
  //     autoRotate: true,
  //     duration: 1000,
  //     destination: {
  //       latitude:23.10229,
  //       longitude:113.3345211,
  //     },
  //     animationEnd() {
  //       console.log('animation end')
  //     }
  //   })
  // },
  // includePoints: function() {
  //   this.mapCtx.includePoints({
  //     padding: [10],
  //     points: [{
  //       latitude:23.10229,
  //       longitude:113.3345211,
  //     }, {
  //       latitude:23.00229,
  //       longitude:113.3345211,
  //     }]
  //   })
  // }
})

