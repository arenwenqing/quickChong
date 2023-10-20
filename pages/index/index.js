// index.js
import { url, getUserInfo, QQMapWX } from '../../utils/util'
// 获取应用实例
const app = getApp()
const mapIcon = {
  '充电桩': '/image/chongdiangzhuang-map-icon.png',
  '换电柜': '/image/huandiangui-map-icon.png',
  '充电柜': '/image/chongdiangui-map-icon.png'
}
const selectMapIcon = {
  '充电桩': '/image/dianzhuang-xuan.png',
  '换电柜': '/image/huandiangui-xuan.png',
  '充电柜': '/image/diangui-xuan.png'
}
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
    },
    showLogin: false,
    showCity: false
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

  loginSureHandle(){
    setTimeout(() => {
      this.setData({
        showLogin: false
      })
    }, 500)
  },

  onLoad: function (options) {
    // 检查ticket是否存在
    if (wx.getStorageSync('ticket')) {
      // 先检查用户是否登录
      this.checkSessionHandle()
    } else {
      wx.clearStorageSync()
      this.login()
    }
  },

  // 申请获取位置的操作
  appForLocation () {
    // 先校验用户是否拒绝过
    if (wx.getStorageSync('scope.userLocation') === false) {
      this.checkSetting()
    } else {
      this.getCurrentLocation()
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
          this.getCurrentLocation()
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
        console.log('登录失败！' + err.errMsg)
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
        wx.setStorageSync('ticket', res.data.data?.ticket)
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
          this.getCurrentLocation()
        } else {
          // 没有授权，弹出提示框
          this.showToast()
        }
      }
    })
  },

  // 搜索
  toSearch() {
    wx.navigateTo({
      url: `/pages/search/index?latitude=${this.data.latitude}&longitude=${this.data.longitude}`,
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

  getCurrentLocation: function () {
    wx.showLoading({
      title: '加载中...',
    })
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 3500,
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.setStorageSync('currentPosition', JSON.stringify({ latitude, longitude }))
        this.setData({
          latitude: latitude,
          longitude: longitude
        })
      },
      fail: (err) => {
        console.error(err)
        wx.setStorageSync('scope.userLocation', false)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 地图拖拽时更新地图的中心坐标
  regionchange(e) {
    // 地图视野变化时触发
    if (e.type === 'end') {
      // 用户停止拖动地图
      // 创建 map 上下文对象
      this.mapCtx = wx.createMapContext('myMap')
      this.mapCtx.getCenterLocation({
        success: (res) => {
          // 设置当前的地图中心坐标为用户坐标
          wx.setStorageSync('currentPosition', JSON.stringify({ latitude: res.latitude, longitude: res.longitude }))
          // 根据当前的地图中心坐标，查看周围的设备
          const obj = this.data.chargeBtnArray.find(item => item.id === this.data.choiceTypeValue)
          this.getDeviceList(obj.value, res.latitude, res.longitude)
        },
        fail: (err) => {
          console.error(err)
        }
      })
    }
  },

  // 点击标记点
  markertap(event) {
    if (!wx.getStorageSync('nickName')) {
      return this.setData({
        showLogin: true
      })
    }
    const markerId = event.markerId || event.detail.markerId; // 获取点击的标记点的 id
    const selectedMarker = this.data.markers.find(marker => marker.id === markerId);
    // 在这里可以根据 selectedMarker 执行需要的操作，比如显示信息窗口等
    console.log("点击了标记点：" + selectedMarker.id);
    const tempArr = JSON.parse(JSON.stringify(this.data.markers))
    tempArr.forEach(item => {
      item.iconPath = item.id === markerId ? item.selectIconPath : mapIcon[item.deviceType]
    })
    this.setData({
      markers: tempArr
    })
    this.getDeviceDetail(selectedMarker)
  },

  // 关闭详情
  closeMarkDetail() {
    this.setData({
      markCheckedShow: false
    })
    const tempArr = JSON.parse(JSON.stringify(this.data.markers))
    tempArr.forEach(item => {
      item.iconPath = mapIcon[item.deviceType]
    })
    this.setData({
      markers: tempArr
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
      choiceTypeValue: e.currentTarget.dataset.index,
      markCheckedShow: false
    }, () => {
      const obj = this.data.chargeBtnArray.find(item => item.id === e.currentTarget.dataset.index)
      const getCenter = JSON.parse(wx.getStorageSync('centerPosition') || '{}')
      if (getCenter.longitude) {
        this.getDeviceList(obj.value, getCenter.latitude, getCenter.longitude)
      } else {
        this.getDeviceList(obj.value)
      }
    })
  },

  // 添加设备
  addDeviceHandle() {
    const tempCurrentUserInfo = wx.getStorageSync('nickName')
    if (tempCurrentUserInfo) {
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
    } else {
      this.setData({
        showLogin: true
      })
    }
  },

  

  // 获取用户所在位置附近的设备列表
  getDeviceList(type, latitude2, longitude2) {
    const currentPosition = JSON.parse(wx.getStorageSync('currentPosition') || '{}')
    const latitude = latitude2 || currentPosition.latitude
    const longitude = longitude2 || currentPosition.longitude
    wx.request({
      url: url + '/api/device/nearbyList',
      method: 'GET',
      data: {
        city: app.globalData.address,
        device_type: type,
        coordinate: `${latitude},${longitude}`,
        page: 1,
        size: 20,
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        if (res.data.code !== 0) {
          return this.login()
        }
        const data = res.data.data?.list || []
        const tempMarkers = data.map((item, index) => {
          const coordinate = item.coordinate.split(',')
          return {
            id: item.id * 1,
            latitude: coordinate[0] * 1,
            longitude: coordinate[1] * 1,
            iconPath: mapIcon[item.device_type],
            selectIconPath: selectMapIcon[item.device_type],
            deviceType: item.device_type,
            // joinCluster: true,
            width: 50, // 标记点图标宽度
            height: 55 // 标记点图标高度
          }
        })
        this.setData({
          markers: tempMarkers
        })
      },
      fail: (err) => {
        console.error(err)
      },
    })
  },

  // 获取设备详情
  getDeviceDetail(param) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 3500,
      success: (res) => {
        const latitude = res.latitude
        const longitude = res.longitude
        wx.request({
          url: url + '/api/device/detail',
          method: 'GET',
          data: {
            ticket: wx.getStorageSync('ticket'),
            id: param.id,
            coordinate: `${latitude},${longitude}`
          },
          success: (res) => {
            this.setData({
              deviceDetail: res.data.data,
              markCheckedShow: true
            })
            // 开始路线规划
            // this.line(`${latitude},${longitude}`, `${res.data.data.coordinate}`)
          },
          fail: () => {
            wx.showToast({
              title: '获取设备出错',
              icon: 'fail'
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },

  onShow() {
    if (wx.getStorageSync('ticket')) {
      const obj = this.data.chargeBtnArray.find(item => item.id === this.data.choiceTypeValue)
      this.getDeviceList(obj.value)

      const options = JSON.parse(wx.getStorageSync('detailObj') || '{}')
      if (!options.id) return
      const markerId = options.id // 获取点击的标记点的 id
      const selectedMarker = this.data.markers.find(marker => marker.id === markerId) || {}
      if (!selectedMarker.id) return
      // 在这里可以根据 selectedMarker 执行需要的操作，比如显示信息窗口等
      console.log("点击了标记点：" + selectedMarker.id);
      const tempArr = JSON.parse(JSON.stringify(this.data.markers))
      tempArr.forEach(item => {
        item.iconPath = item.id === markerId ? item.selectIconPath : mapIcon[item.deviceType]
      })
      this.getDeviceDetail(selectedMarker)
      setTimeout(() => {
        this.setData({
          markers: tempArr
        })
      }, 500)
      this.mapCtx.moveToLocation({
        latitude: options.latitude * 1,
        longitude: options.longitude * 1,
        success: () => {
          // 移动成功
          wx.removeStorageSync('detailObj')
        },
        fail: function (error) {
          // 移动失败，可以处理错误情况
          console.error(error);
        }
      });
    }
  },

  // 回到当前位置
  goBackCurrentPosition() {
    const currentPosion = {
      latitude: this.data.latitude,
      longitude: this.data.longitude
    }
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

  // 城市选择
  showAddressChoice() {
    this.setData({
      show: true
    })
  },

  // 调用第三方导航
  goPosition() {
    const tempObj = this.data.deviceDetail
    wx.openLocation({
      latitude: tempObj.coordinate.split(',')[0] * 1, // 目的地纬度
      longitude: tempObj.coordinate.split(',')[1] * 1, // 目的地经度
      name: tempObj.name, // 目的地名称
      address: tempObj.address, // 目的地地址
    })
    // const currentPosion = JSON.parse(wx.getStorageSync('currentPosition') || {})
  },

  // 关闭城市选择
  onClose() {
    this.setData({
      show: false
    })
  },

  // 路线规划
  line(from, to) {
    QQMapWX.direction({
      mode: 'bicycling',
      from,
      to,
      accuracy: 2,
      success: (res) => {
        console.log(res.data)
        var result = res.result
        var route = result.routes[0]
        var coors = route.polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        this.setData({
          // 将路线的起点设置为地图中心点
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          // 绘制路线
          polyline: [{
            points: pl,
            color: '#58c16c',
            width: 4,
            borderColor: '#2f693c',
            borderWidth: 1
          }],
        })
      },
      fail: (err) => {
        console.error(err)
      }
    })
  },
  // 禁止滚动
  openRegular() {
    this.setData({
      showCity: true
    })
  },

  // 选中城市
  selectAddress() {
    console.log(app.globalData.address)
    this.onLoad()
    this.onShow()
  }
})

