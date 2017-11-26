var mongoose = require('mongoose')
// 内容的表结构
module.exports = new mongoose.Schema({
  // 标题
  name: String,
  // 邮箱
  email: String,
  // 评论内容
  comment: String,
  // 文章的id --关联字段
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  },
  // 被评论的人的邮箱
  commented: {
    type: String,
    default: '1031924189@qq.com'
  },
  // 被评论的人的昵称
  commentedName: {
    type: String,
    default: ''
  },
  // 添加时间
  addTime: {
    type: Date,
    default: Date.now
  }
})
