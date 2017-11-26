var mongoose = require('mongoose')
// 内容的表结构
module.exports = new mongoose.Schema({
  // 标题
  name: String,
  // 邮箱
  email: String,
  // 博客描述
  description: String,
  // 博客描述
  emailInfrom: {
    type: Boolean,
    default: false
  },
  copyright: {
    onOff: {
      type: Boolean,
      default: true
    },
    info: {
      type: String,
      default: '本文为博主原创文章，未经博主允许不得转载。'
    }
  },
  loginId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})
