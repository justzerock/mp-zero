//这里定义了3个自定义属性他们通过{{}}与wxml中的数据连接起来
Component({
  properties: {
    type: {
      type: String,
      value: ''
    },
    color: {
      type: String,
      value: '#000000'
    },
    size: {
      type: Number,
      value: '45'
    }
  }
})
