// pages/componets/indexNavbar/index.js
import { areaList } from '@vant/area-data'
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // defaultData（父页面传递的数据-就是引用组件的页面）
    defaultData: {
      type: Object,
      value: {
        title: ""
      },
      observer: function(newVal, oldVal) {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navBarHeight: app.globalData.navBarHeight,
    menuRight: app.globalData.menuRight,
    menuTop: app.globalData.menuTop,
    menuHeight: app.globalData.menuHeight,
    areaList,
    show: false,
    currentCity: '北京'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchChangeAddress() {
      this.triggerEvent('openRegular', {});
      this.setData({
        show: true
      })
      console.log(areaList)
    },
    confirm(e) {
      app.globalData.address = e.detail.values[1].name
      this.setData({
        currentCity: e.detail.values[1].name
      })
      this.triggerEvent('selectAddress', {})
      this.onClose()
    },
    onClose() {
      this.setData({
        show: false
      })
    }
  }
})
