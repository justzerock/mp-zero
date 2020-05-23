Component({
  properties: {
    color: {
      type: String,
      value: ''
    },
    background: {
      type: String,
      value: ''
    },
    current: {
      type: String,
      value: ''
    },
    hasHomeBar: {
      type: Boolean,
      value: false
    }
  },
  data: {
    // 这里是一些组件内部数据
    other: 'rgba(0, 0, 0, 0.3)'
  },
  methods: {
    // 这里是一个自定义方法
    switch: (e) => {
      // 判断是否为主页面防止原地跳转
      let key = e.currentTarget.dataset.hi
      wx.switchTab({
        url: '/pages/'+key+'/'+key,
      })
    }
  }
})
