// 创建模型，对表结构进行操作。
var mongoose = require('mongoose')
var LabelSchema = require('../schemas/label')
module.exports = mongoose.model('Label', LabelSchema)
