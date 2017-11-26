/**
 * Created by Administrator on 2017/11/7.
 */
var express = require('express')
var router = express.Router()
var User = require('../models/user')

var responseData
router.use(function (req, res, next) {
  responseData = {
    user: req.cookies.get('userInfo') || null,
    code: 0,
    message: '',
    users: []
  }
  next()
})

router.get('/user/search', function (req, res, next) {
  // skip(number) 忽略的条数
  var page = req.query.page || 1  // 当前页
  var limit = 4
  var pages = 0 // 总页数
  User.count().then(function (count) {
    pages = Math.ceil(count / limit)
    page = Math.max(page, 1) // 当前页不能小于1页
    page = Math.min(page, pages) // 当前页不能超过总页数
    var skip = (page - 1) * limit
    User.find().limit(limit).skip(skip).then(function (users) {
      responseData.users = users
      responseData.page = page
      responseData.pages = pages
      res.json(responseData)
    })
  })
})
module.exports = router
