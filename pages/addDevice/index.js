// pages/addDevice/index.js
import { url } from '../../utils/util'
import Toast from '@vant/weapp/toast/toast'
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    deviceData: [{
      name: '充电桩',
      icon: '/image/chongdianzhuang-icon.png',
      selectIcon: '/image/device-chongdianzhuang-select-icon.png',
      id: 0
    }, {
      name: '充电柜',
      icon: '/image/chongdiangui-select.png',
      selectIcon: '/image/deveice-chongdiangui-select-icon.png',
      id: 1
    }, {
      name: '换电柜',
      icon: '/image/huandiangui-icon.png',
      selectIcon: '/image/device-huandiangui-select-icon.png',
      id: 2
    }],
    choiceDeviceValue: -1,
    deviceTypeData: [{
      name: '公共充电设备',
      value: 2
    }, {
      name: '小区内充电设备',
      value: 1
    }],
    deviceMonitorData: [{
      text: '单独配置监控措施',
      value: '单独配置监控措施'
    }, {
      text: '周围建筑有监控',
      value: '周围建筑有监控'
    }, {
      text: '无监控措施',
      value: '无监控措施'
    }],
    typeValue: -1,
    fileData: null,
    fileList: [
    ],
    addressValue: '',
    addressShow: false,
    addressListData: [],
    addressLoading: false,
    currentPageIndex: 1,
    ifLoadMore: false,
  
    devicePosition: null, // 充电位置的文字
    name: null, // 设备的位置name导航用
    address: null, // 详细地址
    coordinate: null, // 坐标
    city: null, // 城市
    email: null, // 邮箱
    brand: null, // 品牌
    device_code: null, // 设备编码
    brand_contact: null, // 联系方式
    around_monitor: '', // 监控
    deveiceData: {
      is_scancode: false, // 扫码充电
      is_rainshelter: false, // 是否有防雨棚
      is_charger: false, // 是否自带充电器
      loc_type: null, // 是小区，还是公共
      device_port: 0, // 充电口数量
      description: null, // 描述
      picture: [], // 上传的图片
      device_type: null, // 充电设备类型
    },
    showProcess: false,
    processValue: 0,
    focusFlag: false,
    monitorShow: false,
    actions: [{
      name: '单独配置监控措施',
      color: '#646566'
    }, {
      name: '周围建筑有监控',
      color: '#646566'
    }, {
      name: '无监控措施',
      color: '#646566'
    }]
  },

  // 监控选择
  showMonitor() {
    this.setData({
      monitorShow: true
    })
  },

  // 关闭
  onCloseAction() {
    this.setData({
      monitorShow: false
    })
  },

  // action 选择
  onSelect(event) {
    this.setData({
      around_monitor: event.detail.name
    })
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

  // 扫码充电
  scanCode({ detail }) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_scancode: detail
      }
    })
  },

  // 防雨棚
  rainshelter({ detail }) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_rainshelter: detail
      }
    })
  },

  // 是否自带充电器
  auoCharger({ detail }) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        is_charger: detail
      }
    })
  },

  // 选择充电设备类型
  choiceDeviceType(e) {
    this.setData({
      choiceDeviceValue: e.currentTarget.dataset.index,
      deveiceData: {
        ...this.data.deveiceData,
        device_type: e.currentTarget.dataset.name
      }
    })
  },

  // 端口数量
  devicePortHandle(value) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        device_port: value.detail
      }
    })
  },

  // 上传的图片删除
  imageDelete(e) {
    console.log(e.detail.index)
    const tempArr = this.data.fileList
    tempArr.splice(e.detail.index, 1)
    const tempPicture = tempArr.map(item => item.url)
    this.setData({
      fileList: tempArr,
      deveiceData: {
        ...this.data.deveiceData,
        picture: tempPicture
      }
    })
  },

  // 描述
  descriptionValueChange(e) {
    this.setData({
      deveiceData: {
        ...this.data.deveiceData,
        description: e.detail
      }
    })
  },

  // 上传操作
  afterRead(event) {
    const { file } = event.detail;
    file.forEach(item => {
      const uploadTask = wx.uploadFile({
        url: url + "/api/file/upload", // 服务端接收上传文件的路由
        filePath: item.url,
        name: 'file',
        formData: {
          ticket: wx.getStorageSync("ticket"), // 其他额外的表单数据
        },
        success: (res) => {
          const responseData = JSON.parse(res.data)
          if (responseData.code !== 0) {
            return wx.showToast({
              title: responseData.msg,
              icon: 'error'
            })
            
          }
          wx.showToast({
            title: "上传成功",
            icon: "success",
          });
          const arr = this.data.fileList.concat([
            {
              url: responseData.data.url,
              deletable: true,
              name: "图片",
            },
          ])
          const tempPicture = arr.map(item => item.url)
          this.setData({
            fileList: arr,
            deveiceData: {
              ...this.data.deveiceData,
              picture: tempPicture
            }
          });
        },
        fail: (err) => {
          wx.showToast({
            title: "上传失败",
            icon: "error",
          });
        },
      });
      uploadTask.onProgressUpdate((res) => {
        this.setData({
          showProcess: true,
          processValue: res.progress
        })
        if (res.progress === 100) {
          this.setData({
            showProcess: false,
            processValue: 0
          })
        }
      })
    })
  },

  // // 监控选择
  // radioChange(e) {
  //   this.setData({
  //     around_monitor: e.detail
  //   })
  // },

  // 提交
  addDeviceHandle() {
    if (!this.data.deveiceData.device_type || !this.data.name) {
      return Toast('设备类型和设备位置不能为空')
    }
    if (this.data.deveiceData.picture.length < 3) {
      return Toast('设备图片至少三张')
    }
    wx.request({
      url: url + '/api/device/add',
      method: 'POST',
      data: {
        ...this.data.deveiceData,
        devicePosition: this.data.devicePosition, // 充电位置的文字
        address: this.data.address, // 详细地址
        coordinate: this.data.coordinate, // 坐标
        city: this.data.city, // 城市
        email: this.data.email, // 邮箱
        brand: this.data.brand, // 品牌
        device_code: this.data.device_code, // 设备编码
        brand_contact: this.data.brand_contact, // 联系方式
        around_monitor: this.data.around_monitor, // 监控个数
        name: this.data.name, // 设备位置
        ticket: wx.getStorageSync('ticket')
      },
      success: (res) => {
        if (!res.data.code) {
          wx.showToast({
            title: '等待审核',
            icon: 'success'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'fail'
          })
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '添加失败',
          icon: 'fail'
        })
      }
    })
  },

  // 获取焦点
  addressFocus() {
    this.setData({
      addressShow: true,
    })
    setTimeout(() => {
      this.setData({
        focusFlag: true,
      })
    }, 500)
  },

  // 关闭添加地址
  onClose() {
    this.setData({
      addressShow: false,
      focusFlag: false
    })
  },

  // 选择地址
  choiceAddress(e) {
    const choiceObj = e.currentTarget.dataset.data
    this.setData({
      addressShow: false,
      city: choiceObj.city,
      coordinate: `${choiceObj.location.lat},${choiceObj.location.lng}`,
      devicePosition: choiceObj.title,
      name: choiceObj.title,
      address: choiceObj.address
    })
  },

  // 添加地址
  addSearchInputChange(val) {
    this.setData({
      addressValue: val.detail && val.detail.trim(),
      currentPageIndex: 1,
      addressListData: []
    })
    if (!val.detail) {
      this.setData({
        addressListData: []
      })
    }
  },

  //点击搜索
  clickSearch() {
    this.setData({
      addressListData: [],
      ifLoadMore: true,
      currentPageIndex: 1
    }, () => {
      this.searchPosition(this.data.addressValue)
    })
  },

  // 搜索位置
  searchPosition(val) {
    const value = val.detail || val
    this.setData({
      addressLoading: true
    })
    // 获取当前坐标
    const currentPosion = JSON.parse(wx.getStorageSync('currentPosition') || {})
    wx.request({
      url: 'https://apis.map.qq.com/ws/place/v1/suggestion',
      method: 'GET',
      data: {
        key: '2IQBZ-GCWLL-DSGPF-EJPAM-5HDEV-ILB4O',
        keyword: value,
        region: app.globalData.address,
        page_index: this.data.currentPageIndex,
        page_size: 20,
        region_fix: 1,
        get_subpois: 1,
        policy: 1,
        location: `${currentPosion.latitude},${currentPosion.longitude}`
      },
      success: (res) => {
        const tempMap = res.data.data || []
        this.setData({
          addressListData: this.data.addressListData.concat(tempMap),
          ifLoadMore: res.data.data.length >= 20,
          currentPageIndex: res.data.data.length >= 20 ? this.data.currentPageIndex + 1 : this.data.currentPageIndex
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

  // 添加地址时滚动到底部加载
  scrollToLower() {
    console.log('滚动到底部了')
    if (this.data.ifLoadMore) {
      this.searchPosition(this.data.addressValue)
    }
  },

  // 选择类型
  choiceType(e) {
    this.setData({
      typeValue: e.currentTarget.dataset.index,
      deveiceData: {
        ...this.data.deveiceData,
        loc_type: e.currentTarget.dataset.index === 0 ? 2 : 1
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