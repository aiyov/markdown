// 创建模型，对表结构进行操作。
var mongoose = require('mongoose')
var usersSchema = require('../schemas/users')
module.exports = mongoose.model('User', usersSchema)
