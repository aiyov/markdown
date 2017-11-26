// 创建模型，对表结构进行操作。
var mongoose = require('mongoose')
var commentSchema = require('../schemas/comment')
module.exports = mongoose.model('Comment', commentSchema)
