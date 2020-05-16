var amap = {
  key: '9d3f868b4119b22a7a475f08cfab07cd'
}
var heweather = {
  key: 'cdea1b46581e44fca53c8b94f5c1b578'
}
var ciba = {
  key: 'KEY-VALUE'
}

var daily = {
  link: 'https://open.iciba.com/dsapi/'
}

var shadeColor = function (hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  var rgb = [r, g, b];
  //186
  return (r * 0.299 + g * 0.587 + b * 0.114) > 180 ?
    false :
    true;
}

var setColor = function (hex) {
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  // convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }
  var r = parseInt(hex.slice(0, 2), 16),
    g = parseInt(hex.slice(2, 4), 16),
    b = parseInt(hex.slice(4, 6), 16);
  var rgb = [r, g, b];
  //186
  return (r * 0.299 + g * 0.587 + b * 0.114) > 180 ?
    tcrgb(rgb, -0.4) :
    tcrgb(rgb, 0.95);
}

var tcrgb = function (color, percent) {
  var f = color
  var t = percent < 0 ? 0 : 255
  var p = percent < 0 ? percent * -1 : percent
  var R = parseInt(f[0])
  var G = parseInt(f[1])
  var B = parseInt(f[2])
  return '#' + (Math.round((t - R) * p) + R).toString(16) + (Math.round((t - G) * p) + G).toString(16) + (Math.round((t - B) * p) + B).toString(16)
}

var colors = [
    { "key": "红色系", "color": "#BE002F", "fcolor": "#fcf2f5", "colors": 
      [{ "name": "绾", "value": "#A98175", "fvalue": "#fbf9f8" }, { "name": "檀", "value": "#B36D61", "fvalue": "#fbf8f7" }, { "name": "栗色", "value": "#60281E", "fvalue": "#f7f4f4" }, { "name": "玄", "value": "#622A1D", "fvalue": "#f7f4f4" }, { "name": "胭脂", "value": "#9D2933", "fvalue": "#faf4f5" }, { "name": "殷红", "value": "#BE002F", "fvalue": "#fcf2f5" }, { "name": "枣红", "value": "#C32136", "fvalue": "#fcf4f5" }, { "name": "赤", "value": "#C3272B", "fvalue": "#fcf4f4" }, { "name": "绯红", "value": "#C83C23", "fvalue": "#fcf5f4" }, { "name": "赫赤", "value": "#C91F37", "fvalue": "#fcf4f5" }, { "name": "樱桃红", "value": "#C93756", "fvalue": "#fcf5f7" }, { "name": "茜色", "value": "#CB3A56", "fvalue": "#fcf5f7" }, { "name": "海棠红", "value": "#DB5A6B", "fvalue": "#fdf7f8" }, { "name": "酡红", "value": "#DC3023", "fvalue": "#fdf5f4" }, { "name": "妃色", "value": "#ED5736", "fvalue": "#fef7f5" }, { "name": "嫣红", "value": "#EF7A82", "fvalue": "#fef8f9" }, { "name": "品红", "value": "#F00056", "fvalue": "#fef2f7" }, { "name": "石榴红", "value": "#F20C00", "fvalue": "#fef3f2" }, { "name": "银红", "value": "#F05654", "fvalue": "#fef7f6" }, { "name": "彤", "value": "#F35336", "fvalue": "#fef6f5" }, { "name": "桃红", "value": "#F47983", "fvalue": "#fef8f9" }, { "name": "酡颜", "value": "#F9906F", "fvalue": "#fff9f8" }, { "name": "洋红", "value": "#FF0097", "fvalue": "#fff2fa" }, { "name": "大红", "value": "#FF2121", "fvalue": "#fff4f4" }, { "name": "火红", "value": "#FF2D51", "fvalue": "#fff5f6" }, { "name": "炎", "value": "#FF3300", "fvalue": "#fff5f2" }, { "name": "朱红", "value": "#FF4C00", "fvalue": "#fff6f2" }, { "name": "丹", "value": "#FF4E20", "fvalue": "#fff6f4" }] 
    }, 
    { "key": "橙色系", "color": "#FA8C35", "fcolor": "#fff9f5", "colors": 
      [{ "name": "褐色", "value": "#6E511E", "fvalue": "#f8f6f4" }, { "name": "棕黑", "value": "#7C4B00", "fvalue": "#f8f6f2" }, { "name": "赭色", "value": "#955539", "fvalue": "#faf7f5" }, { "name": "棕红", "value": "#9B4400", "fvalue": "#faf6f2" }, { "name": "赭", "value": "#9C5333", "fvalue": "#faf6f5" }, { "name": "驼色", "value": "#A88462", "fvalue": "#fbf9f7" }, { "name": "棕色", "value": "#B25D25", "fvalue": "#fbf7f4" }, { "name": "茶色", "value": "#B35C44", "fvalue": "#fbf7f6" }, { "name": "琥珀", "value": "#CA6924", "fvalue": "#fcf8f4" }, { "name": "黄栌", "value": "#E29C45", "fvalue": "#fefaf6" }, { "name": "橙色", "value": "#FA8C35", "fvalue": "#fff9f5" }, { "name": "橘红", "value": "#FF7500", "fvalue": "#fff8f2" }, { "name": "橘黄", "value": "#FF8936", "fvalue": "#fff9f5" }, { "name": "杏红", "value": "#FF8C31", "fvalue": "#fff9f5" }, { "name": "橙黄", "value": "#FFA400", "fvalue": "#fffaf2" }, { "name": "杏黄", "value": "#FFA631", "fvalue": "#fffbf5" }] 
    }, 
    { "key": "黄色系", "color": "#C89B40", "fcolor": "#fcfaf5", "colors": 
      [{ "name": "黧", "value": "#5D513C", "fvalue": "#f7f6f5" }, { "name": "黎", "value": "#75664D", "fvalue": "#f8f7f6" }, { "name": "棕绿", "value": "#827100", "fvalue": "#f9f8f2" }, { "name": "秋色", "value": "#896C39", "fvalue": "#f9f8f5" }, { "name": "苍黄", "value": "#A29B7C", "fvalue": "#fafaf8" }, { "name": "乌金", "value": "#A78E44", "fvalue": "#fbf9f6" }, { "name": "棕黄", "value": "#AE7000", "fvalue": "#fbf8f2" }, { "name": "昏黄", "value": "#C89B40", "fvalue": "#fcfaf5" }] 
    }, 
    { "key": "绿色系", "color": "#21A675", "fcolor": "#f4fbf8", "colors": 
      [{ "name": "竹青", "value": "#789262", "fvalue": "#f8faf7" }, { "name": "黯", "value": "#41555D", "fvalue": "#f6f7f7" }, { "name": "黛绿", "value": "#426666", "fvalue": "#f6f7f7" }, { "name": "松花绿", "value": "#057748", "fvalue": "#f3f8f6" }, { "name": "绿沈", "value": "#0C8918", "fvalue": "#f3f9f3" }, { "name": "深绿", "value": "#009900", "fvalue": "#f2faf2" }, { "name": "青葱", "value": "#0AA344", "fvalue": "#f3faf6" }, { "name": "铜绿", "value": "#549688", "fvalue": "#f6faf9" }, { "name": "苍翠", "value": "#519A73", "fvalue": "#f6faf8" }, { "name": "松柏绿", "value": "#21A675", "fvalue": "#f4fbf8" }, { "name": "葱青", "value": "#0EB83A", "fvalue": "#f3fbf5" }, { "name": "油绿", "value": "#00BC12", "fvalue": "#f2fcf3" }, { "name": "绿", "value": "#00E500", "fvalue": "#f2fef2" }, { "name": "草绿", "value": "#40DE5A", "fvalue": "#f5fdf7" }, { "name": "豆青", "value": "#96CE54", "fvalue": "#fafdf6" }, { "name": "豆绿", "value": "#9ED048", "fvalue": "#fafdf6" }, { "name": "葱绿", "value": "#9ED900", "fvalue": "#fafdf2" }, { "name": "葱黄", "value": "#A3D900", "fvalue": "#fafdf2" }] 
    }, 
    { "key": "青色系", "color": "#3DE1AD", "fcolor": "#f5fefb", "colors": 
      [{ "name": "水", "value": "#88ADA6", "fvalue": "#f9fbfb" }, { "name": "青碧", "value": "#48C0A3", "fvalue": "#f6fcfa" }, { "name": "碧", "value": "#1BD1A5", "fvalue": "#f4fdfb" }, { "name": "石青", "value": "#7BCFA6", "fvalue": "#f8fdfb" }, { "name": "青翠", "value": "#00E079", "fvalue": "#f2fdf8" }, { "name": "青", "value": "#00E09E", "fvalue": "#f2fdfa" }, { "name": "碧绿", "value": "#2ADD9C", "fvalue": "#f4fdfa" }, { "name": "玉", "value": "#2EDFA3", "fvalue": "#f5fdfa" }, { "name": "翡翠", "value": "#3DE1AD", "fvalue": "#f5fefb" }] 
    }, 
    { "key": "蓝色系", "color": "#44CEF6", "fcolor": "#f6fdff", "colors": 
      [{ "name": "藏蓝", "value": "#3B2E7E", "fvalue": "#f5f5f9" }, { "name": "宝蓝", "value": "#4B5CC4", "fvalue": "#f6f7fc" }, { "name": "绀青", "value": "#003371", "fvalue": "#f2f5f8" }, { "name": "藏青", "value": "#2E4E7E", "fvalue": "#f5f6f9" }, { "name": "靛蓝", "value": "#065279", "fvalue": "#f3f6f8" }, { "name": "靛青", "value": "#177CB0", "fvalue": "#f3f8fb" }, { "name": "群青", "value": "#4C8DAE", "fvalue": "#f6f9fb" }, { "name": "蓝", "value": "#44CEF6", "fvalue": "#f6fdff" }, { "name": "湖蓝", "value": "#30DFF3", "fvalue": "#f5fdfe" }] 
    }, 
    { "key": "紫色系", "color": "#574266", "fcolor": "#f7f6f7", "colors": 
      [{ "name": "黛", "value": "#4A4266", "fvalue": "#f6f6f7" }, { "name": "紫檀", "value": "#4C211B", "fvalue": "#f6f4f4" }, { "name": "紫棠", "value": "#56004F", "fvalue": "#f7f2f6" }, { "name": "黛紫", "value": "#574266", "fvalue": "#f7f6f7" }, { "name": "绛紫", "value": "#8C4356", "fvalue": "#f9f6f7" }, { "name": "紫酱", "value": "#815463", "fvalue": "#f9f6f7" }, { "name": "酱紫", "value": "#815476", "fvalue": "#f9f6f8" }, { "name": "黝", "value": "#6B6882", "fvalue": "#f8f7f9" }, { "name": "青莲", "value": "#801DAE", "fvalue": "#f9f4fb" }, { "name": "紫", "value": "#8D4BBB", "fvalue": "#f9f6fc" }, { "name": "雪青", "value": "#B0A4E3", "fvalue": "#fbfafe" }] 
    }, 
    { "key": "灰色系", "color": "#758A99", "fcolor": "#f8f9fa", "colors": 
      [{ "name": "黑", "value": "#000000", "fvalue": "#f2f2f2" }, { "name": "漆黑", "value": "#161823", "fvalue": "#f3f3f4" }, { "name": "象牙黑", "value": "#312520", "fvalue": "#f5f4f4" }, { "name": "乌黑", "value": "#392F41", "fvalue": "#f5f5f6" }, { "name": "玄青", "value": "#3D3B4F", "fvalue": "#f5f5f6" }, { "name": "缁", "value": "#493131", "fvalue": "#f6f5f5" }, { "name": "黝黑", "value": "#665757", "fvalue": "#f7f7f7" }, { "name": "鸦青", "value": "#424C50", "fvalue": "#f6f6f6" }, { "name": "黛蓝", "value": "#425066", "fvalue": "#f6f6f7" }, { "name": "苍黑", "value": "#395260", "fvalue": "#f5f6f7" }, { "name": "墨", "value": "#50616D", "fvalue": "#f6f7f8" }, { "name": "灰", "value": "#808080", "fvalue": "#f9f9f9" }, { "name": "苍", "value": "#75878A", "fvalue": "#f8f9f9" }, { "name": "墨灰", "value": "#758A99", "fvalue": "#f8f9fa" }, { "name": "苍青", "value": "#7397AB", "fvalue": "#f8fafb" }, { "name": "蓝灰", "value": "#A1AFC9", "fvalue": "#fafbfc" }] 
    }
  ]

module.exports = {
  amap,
  heweather,
  ciba,
  daily,
  colors,
  shadeColor,
  setColor
}
