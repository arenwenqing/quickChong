// pages/comment/index.js
import { url } from '../../utils/util'
import Toast from '@vant/weapp/toast/toast';
const datas = [{
  name: '位置好找',
  id: 1,
  selected: false
}, {
  name: '信息准确',
  id: 2,
  selected: false
}, {
  name: '设备使用方便',
  id: 3,
  selected: false
},{
  name: '有防雨措施',
  id: 4,
  selected: false
}, {
  name: '充电快',
  id: 5,
  selected: false
}, {
  name: '无乱停放',
  id: 6,
  selected: false
}]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fileList: [
    ],
    commentData: [],
    imageData: [1,1,2,3],
    show: false,
    messageItemData: datas,
    choiceData: [],
    deviceId: 0,
    star_level: 0,
    tag: '',
    comment: '',
    picture: [],
    currentPage: 1,
    ifLoadMore: true,
    showBigImage: {
      flag: false,
      url: ''
    },
    showProcess: false,
    processValue: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      deviceId: options.id
    }, () => this.getCommentList())
  },

  // 评分
  rateChange(e) {
    let tempData = [{
      name: '位置不准',
      id: 1,
      selected: false
    }, {
      name: '设备信息缺失',
      id: 2,
      selected: false
    }, {
      name: '设备故障多',
      id: 3,
      selected: false
    }, {
      name: '无防雨棚',
      id: 4,
      selected: false
    }, {
      name: '充电慢功率低',
      id: 5,
      selected: false
    }, {
      name: '车辆乱停',
      id: 6,
      selected: false
    }]
    if (e.detail >= 3) {
      tempData = datas
    }
    this.setData({
      messageItemData: tempData,
      star_level: e.detail
    })
  },

  // 确定搜索
  searchHandle(e) {
    console.log(e.detail)
    this.setData({
      commentData: [],
      currentPage: 1,
      ifLoadMore: true
    }, () => {
      this.getCommentList(e.detail && e.detail.trim())
    })
  },

  // 获取评价
  getCommentList(keywords = '') {
    wx.showLoading({
      title: '加载中...',
    })
     // 获取评论列表
     wx.request({
      url: url + '/api/user/commentList',
      method: 'GET',
      data: {
        ticket: wx.getStorageSync('ticket'),
        keywords,
        device_id: this.data.deviceId,
        page: this.data.currentPage
      },
      success: (res) => {
        const tempArr = res.data.data.list || []
        tempArr.forEach(item => {
          item.tag = item.tag ? item.tag.split(',') : []
        })
        this.setData({
          commentData: this.data.commentData.concat(tempArr),
          currentPage: (res.data.data.page * 1) + 1,
          ifLoadMore: res.data.data.list.length === 10
        })
      },
      fail: (err) => {

      },
      complete: () => {
        wx.hideLoading()
      }
    })
  },

  // 点击展示大图
  showBig(e) {
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(param) {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 提交评论
   */
  submitComment() {
    this.setData({
      show: true
    })
  },

  // 快速评论
  choiceHandle(e) {
    const index = e.currentTarget.dataset.index
    let arr = []
    if (this.data.choiceData.includes(index)) {
      arr = this.data.choiceData.filter(item => item !== index)
    } else {
      arr = this.data.choiceData.concat([index])
    }
    const tempMessageItemData = JSON.parse(JSON.stringify(this.data.messageItemData))
    tempMessageItemData.forEach(element => {
      if (arr.includes(element.id)) {
        element.selected = true
      } else {
        element.selected = false
      }
    });
    const tempQuickData = []
    this.data.messageItemData.forEach(item => {
      if (arr.includes(item.id)) {
        tempQuickData.push(item.name)
      }
    })
    this.setData({
      choiceData: arr,
      messageItemData: tempMessageItemData,
      tag: tempQuickData.join()
    })
  },

  /**
   * 关闭
   */
  closeCommentPopup() {
    this.setData({
      show: false
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

  // 发表评价
  commentSubmit() {
    if (!this.data.star_level) {
      return Toast('请评等级');
    }
    wx.request({
      url: url + '/api/user/comment',
      method: 'POST',
      data: {
        ticket: wx.getStorageSync('ticket'),
        device_id: this.data.deviceId,
        star_level: this.data.star_level,
        tag: this.data.tag,
        comment: this.data.comment,
        picture: this.data.picture
      },
      success: (res) => {
        if (res.data.code !== 0) {
          return Toast(res.data.msg)
        }
        wx.showToast({
          title: '感谢您的评价',
          icon: 'success',
          duration: 2000
        })
        this.setData({
          show: false,
          commentData: [],
          currentPage: 1
        })
        this.getCommentList()
      },
      fail: (err) => {
        wx.showToast({
          title: '失败',
          icon: 'fail'
        })
      }
    })
  },

   // 添加地址时滚动到底部加载
   scrollToLower() {
    console.log('滚动到底部了')
    if (this.data.ifLoadMore) {
      this.getCommentList()
    }
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