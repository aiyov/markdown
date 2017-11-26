var mongoose = require('mongoose')
// 标签的表结构
module.exports = new mongoose.Schema({
  labelName: String,
  number: Number
})
