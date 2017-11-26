var path = require('path')
var express = require('express')
var swig = require('swig')
var mongoose = require('mongoose')
var Cookies = require('cookies')
var bodyParse = require('body-parser')// 处理post提交过来的数据
var app = express()
var onOff = true

/*
* 这是静态文件托管
* 当用户访问的url以/src开始，那么直接返回对应__dirname+'src'下的文件
* */
app.use('/src', express.static(__dirname+'/src'))
// app.use('/src', express.static(path.resolve(__dirname, '../src')))
app.use('/node_modules', express.static(path.resolve(__dirname, '../node_modules')))
/*
* 配置应用模板，定义当前使用的模板引擎
* 第一个参数：模板引擎的名称，也是模板文件的后缀，第二个参数也是表示用于解析处理模板内容的方法。
* */
app.engine('html', swig.renderFile)
/*
* 设置模板文件的目录，第一个参数必须是views，第二个参数是目录
* */
app.set('views', '../src')
/*
* 在开发过程中关闭模板缓存
* */
swig.setDefaults({cache: false})
/*
* 注册使用的模板引擎，第一个参数必须是view engine，第二个参数和app.engine这个方法中定义的模板引擎的名称是一致的。
* */
app.set('view engine', 'html')
/*
* 通过app.get()或者app.post()等方法可以把一个url路径和一个或多个函数进行绑定
* app.get('/',function(req,res,next){})
* req:request对象-保存客户端请求的一些相关数据-http.request
* res:response对象-服务端输出对象，提供了一些服务端输出的相关的一些方法-http.response
* next:方法，用于执行下一个和路径匹配的函数
* */
/*
* 动态文件托管
* */
app.use(bodyParse.json({limit: '50mb'}))
app.use(bodyParse.urlencoded({limit: '50mb', extended: true}))
app.use(function (req, res, next) {
  req.cookies = new Cookies(req, res)
  // 登录用户的cookies信息
  req.userInfo = {}
  try {
    if (req.cookies.get('userInfo') && !onOff) {
      console.log('hahhahahhah')
      req.cookies.set('userInfo', null)
      onOff = true
    }
    req.userInfo = req.cookies.get('userInfo')
  } catch (e) {}
  next()
})

/*
* 根据不同的功能划分模块，
* */
app.use('/admin', require('./admin'))
app.use('/comment', require('./comment'))
app.use('/user', require('./user'))
app.use('/api', require('./api'))
app.use('/', require('./main'))
/*
* mongodb://localhost:27017/blog => 协议：//地址
* */
mongoose.connect('mongodb://localhost:27018/blog', function (err) {
  if (err) {
    console.log('数据库连接失败')
    return false
  }
  console.log('数据库连接成功')
  app.listen(8081)
})

// 用户发送http请求 > url > 解析路由 > 找到匹配的规则 > 执行指定的函数 > 返回对应内容给用户。

