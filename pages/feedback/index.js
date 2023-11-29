// pages/feedback/index.js
import { url } from '../../utils/util'
import Toast from '@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [],
    picture: [],
    comment: '',
    show: false,
    showProcess: false,
    processValue: 0
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  // 意见反馈
  submitFeedback() {
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url + '/api/user/feedback',
      method: 'POST',
      data: {
        msg: this.data.comment,
        picture: this.data.picture,
        ticket: wx.getStorageSync('ticket'),
      },
      success: (res) => {
        if (res.data.code === 0) {
          this.setData({
            show: true
          })
        } else {
          Toast(res.data.msg);
        }
      },
      fail: (err) => {
        console.error(err.msg)
      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 反馈确定
  confirm() {
    wx.navigateBack({
      delta: 1 // 返回上一级页面
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