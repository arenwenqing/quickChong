// pages/errorCorrection/index.js
import Toast from '@vant/weapp/toast/toast';
import { url } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quickData: [{
      name: '位置有误',
      id: 1,
      value: '位置有误',
      selected: false
    }, {
      name: '地点不存在',
      id: 2,
      value: '地点不存在',
      selected: false
    }, {
      name: '设备信息有误',
      id: 3,
      value: '设备信息有误',
      selected: false
    }],
    choiceData: [],
    comment: '',
    fileList: [],
    picture: [],
    deviceId: 0,
    showProcess: false,
    processValue: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      deviceId: options.id
    })
  },

  choiceType: function (e) {
    const index = e.currentTarget.dataset.index
    let arr = []
    if (this.data.choiceData.includes(index)) {
      arr = this.data.choiceData.filter(item => item !== index)
    } else {
      arr = this.data.choiceData.concat([index])
    }
    const tempMessageItemData = JSON.parse(JSON.stringify(this.data.quickData))
    tempMessageItemData.forEach(element => {
      if (arr.includes(element.id)) {
        element.selected = true
      } else {
        element.selected = false
      }
    });
    this.setData({
      choiceData: arr,
      quickData: tempMessageItemData
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
      picture: tempPicture
    })
  },

  // 上传前校验
  beforeRead(event) {
    const { file, callback } = event.detail;
    if (file[0].size > 5242880) {
      Toast('文件大小不能超过 5M');
      callback(false)
    } else {
      return callback(true)
    }
    // callback(file.type === 'image');
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
          wx.showToast({
            title: "上传成功",
            icon: "success",
          });
          const responseData = JSON.parse(res.data)
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
            picture: tempPicture
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

  // 提交纠错
  errorCorrection() {
    const nameData = this.data.quickData.filter(item => this.data.choiceData.includes(item.id))
    const tempName = nameData.map(item => item.name)
    wx.request({
      url: url + '/api/user/correct',
      method: 'POST',
      data: {
        ticket: wx.getStorageSync('ticket'),
        picture: this.data.picture,
        description: this.data.comment,
        error_type: tempName.join(','),
        device_id: this.data.deviceId
      },
      success: (res) => {
        if (!res.data.code) {
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
        console.error('纠错失败：', err)
      }
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

  }
})