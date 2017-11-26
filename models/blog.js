// 创建模型，对表结构进行操作。
var mongoose = require('mongoose')
var blog = require('../schemas/blog')
module.exports = mongoose.model('Blog', blog)
