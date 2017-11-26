// 创建模型，对表结构进行操作。
var mongoose = require('mongoose')
var contentSchema = require('../schemas/content')
module.exports = mongoose.model('Content', contentSchema)
