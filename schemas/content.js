var mongoose = require('mongoose')
// 内容的表结构
module.exports = new mongoose.Schema({
  // 标题
  title: String,
  // 标签分类的id --关联字段
  labels: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Label'
  },
  user: {
    // 类型
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // 添加时间
  addTime: {
    type: Date,
    default: Date.now
  },
  // 文章状态1：正常 2：被删除。回收站
  status: {
    type: Number,
    default: 1
  },
  // 阅读量
  view: {
    type: Number,
    default: 0
  },
  // 简介
  description: {
    type: String,
    default: ''
  },
  // 内容
  content: {
    type: String,
    default: ''
  },
  commentNumber: {
    type: Number,
    default: 0
  },
  type: String
})
