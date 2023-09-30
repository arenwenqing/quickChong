// pages/componets/bigImage/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showBigImage: {
      type: Boolean,
      value: false
    },
    url: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
 
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickHide () {
      // 触发父组件的方法
      this.triggerEvent('closeMark', {});
    }
  }
})
