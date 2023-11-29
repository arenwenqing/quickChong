var amapFile = require('../libs/amap-wx.130.js')
var QQMapWX = require('../libs/qqmap-wx-jssdk.js')
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}
const url = 'https://www.gathertrack.com'

// 获取用户信息
const getUserInfo = (cb) => {
  const tempCurrentUserInfo = JSON.parse(wx.getStorageSync('userInfo') || '{}')
  if (tempCurrentUserInfo.nickName) return
  wx.getUserProfile({
    desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: (res) => {
      wx.setStorageSync('userInfo', JSON.stringify(res.userInfo))
      cb && cb(res)
      // this.setData({
      //   currentUserInfo: res.userInfo,
      //   ifLogin: wx.getStorageSync('ticket') ? true : false
      // })
    }
  })
}

// 高德 web 的key 516d5a816833c6ee44e3446e40ca22e3
module.exports = {
  formatTime,
  url,
  getUserInfo,
  amapFile: new amapFile.AMapWX({key:'24c3089f745d73fccd2245382fbb2942'}),
  QQMapWX: new QQMapWX({
    key: '2IQBZ-GCWLL-DSGPF-EJPAM-5HDEV-ILB4O'
  })
}
