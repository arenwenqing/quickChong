// pages/componets/getNickName/index.js
import { url } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl: '/image/no-login.png',
    nickNameValue: '',
    avatarUrlValue: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChooseAvatar(e) {
      const { avatarUrl } = e.detail
      this.setData({
        avatarUrl,
      })
    },
    nickNameHandle(e) {
      if (e.detail.pass) {
        wx.setStorageSync('nickName', this.data.nickNameValue)
        wx.setStorageSync('avatarUrl', this.data.avatarUrl)
      }
    },
    nickNameConfirmHandle(e) {
      this.setData({
        nickNameValue: e.detail.value
      })
    },
    loginConfirm(e) {
      if (!this.data.nickNameValue || !this.data.avatarUrl) {
        return wx.showToast({
          title: '不能为空',
          icon: 'error'
        })
      }
      this.setData({
        show: false
      })
      wx.request({
        url: url + '/api/user/setProfile',
        method: 'post',
        data: {
          username: this.data.nickNameValue,
          avatar: this.data.avatarUrl,
          ticket: wx.getStorageSync('ticket')
        },
        success: (res) => {
          console.log(res.data)
        },
        fail: err => {
          console.error(err)
        }
      })
      this.triggerEvent('loginSure', {});
    },
    close(action, done) {
      this.setData({
        show: false
      })
    }
  }
})
