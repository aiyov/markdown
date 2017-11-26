var express = require('express')
var router = express.Router()
var User = require('../models/user')
// 返回格式
var responseData
router.use(function (req, res, next) {
  responseData = {
    code: 0,
    message: ''
  }
  next()
})
/*
 * 用户注册
 *     注册逻辑：
 *     1，用户名不能为空；
 *     2，密码不能为空
 *
 *     1，用户名是否被注册
 * */
router.post('/user/register', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  if (username === '') {
    responseData.code = 1
    responseData.message = '用户名不能为空!'
    res.json(responseData)
    return false
  }
  if (password === '') {
    responseData.code = 2
    responseData.message = '密码不能为空！'
    res.json(responseData)
    return false
  }
  // 用户名查询，是否注册。
  User.findOne({
    username: username // 查询条件
  }).then(function (userInfo) {
    if (userInfo) {
      responseData.code = 4
      responseData.message = '用户名已注册！'
      res.json(responseData)
      return false
    }
    var user = new User({
      username: username,
      password: password
    })
    return user.save()
  }).then(function (newUserInfo) {
    responseData.message = '注册成功！'
    res.json(responseData)
  })
})
/*
 * 用户登录
 * */
router.post('/user/login', function (req, res, next) {
  var username = req.body.username
  var password = req.body.password
  if (username === '' || password === '') {
    responseData.code = 3
    responseData.message = '用户名和密码不能为空！'
    res.json(responseData)
    return false
  }
  User.findOne({
    username: username,
    password: password
  }).then(function (userInfo) {
    if (!userInfo) {
      responseData.code = 5
      responseData.message = '用户名或密码错误！'
      res.json(responseData)
      return false
    }
    responseData.message = '登录成功！'
    responseData.userInfo = {
      'id': userInfo.id,
      'username': userInfo.username
    }
    req.cookies.set('userInfo', JSON.stringify({
      'id': userInfo.id,
      'username': userInfo.username
    }))
    res.json(responseData)
  })
})
router.get('/user/loginout', function (req, res, next) {
  req.cookies.set('userInfo', null)
  responseData.message = '退出成功'
  res.json(responseData)
})
module.exports = router
