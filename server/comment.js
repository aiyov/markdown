var express = require('express')
var router = express.Router()
var Comment = require('../models/comment')
var Content = require('../models/content')
var Blog = require('../models/blog')
var nodemailer = require('nodemailer') //  加载发送邮件服务

var transporter = nodemailer.createTransport({
  // https://github.com/andris9/nodemailer-wellknown#supported-services 支持列表
  service: 'qq',
  port: 465, // SMTP 端口
  secureConnection: true, // 使用 SSL
  auth: {
    user: '1031924189@qq.com',
    // 这里密码不是qq密码，是你设置的smtp密码
    pass: 'gnhmhcoooumzbbhd'
  }
})

var responseData
router.use(function (req, res, next) {
  responseData = {
    user: req.cookies.get('userInfo') || null,
    code: 0,
    message: '',
    comments: []
  }
  next()
})
// 获取所有评论
router.get('/comment/getAll', function (req, res, next) {
  // skip(number) 忽略的条数
  var page = req.query.page || 1  // 当前页
  var limit = 5
  var pages = 0 // 总页数
  Comment.find().count().then(function (count) {
    pages = Math.ceil(count / limit)
    page = Math.max(page, 1) // 当前页不能小于1页
    page = Math.min(page, pages) // 当前页不能超过总页数
    var skip = (page - 1) * limit
    if (count === 0) {
      responseData.comments = []
      responseData.page = page
      responseData.pages = pages
      res.json(responseData)
      return false
    }
    Comment.find().limit(limit).skip(skip).populate('article').then(function (content) {
      responseData.comments = content
      responseData.page = page
      responseData.pages = pages
      res.json(responseData)
    })
  })
})
// 获取文章所有的评论
router.post('/comment/get', function (req, res, next) {
  var id = req.body.id
  Comment.find({'article': id}).then(function (comment) {
    responseData.comments = comment
    responseData.message = '查询成功！'
    res.json(responseData)
  })
})
// 获取最新的评论且文章状态为1
router.post('/comment/getNew', function (req, res, next) {
  Content.find({'status': 1}).then(function (Content) {
    var ContentId = Content.map(function (item) {
      return item._id
    })
    Comment.find({'article': {$in: ContentId}}).sort({'addTime': -1}).limit(10).populate('article').then(function (comment) {
      responseData.comments = comment
      responseData.message = '查询成功！'
      res.json(responseData)
    })
  })
})
// 删除评论
router.get('/comment/del', function (req, res, next) {
  var id = req.query.id
  Comment.findOne({
    _id: id
  }).then(function (comment) {
    if (!comment) {
      responseData.code = 2
      responseData.message = '分类不存在！'
      res.json(responseData)
      return Promise.reject()
    } else {
      return Comment.remove({
        _id: id
      }).then(function () {
        return Content.findOne({
          _id: comment.article
        }).then(function (content) {
          content.commentNumber--
          content.save()
        })
      })
    }
  }).then(function () {
    responseData.message = '删除成功！'
    res.json(responseData)
  })
})
// 删除评论并返回当页评论，总页数，当前页
router.post('/comment/remove', function (req, res, next) {
  var id = req.body.id || ''
  var page = req.body.page || 1
  var limit = 5
  var pages = 0 // 总页数
  Comment.findOne({
    _id: id
  }).then(function (content) {
    if (!content) {
      responseData.code = 2
      responseData.message = '分类不存在！'
      res.json(responseData)
      return Promise.reject()
    } else {
      return Comment.remove({
        _id: id
      }).then(function () {
        return Content.findOne({
          _id: content.article
        }).then(function (content) {
          content.commentNumber--
          content.save()
        })
      })
    }
  }).then(function () {
    return Comment.find().count().then(function (count) {
      pages = Math.ceil(count / limit)
      page = Math.max(page, 1) // 当前页不能小于1页
      page = Math.min(page, pages) // 当前页不能超过总页数
      var skip = (page - 1) * limit
      if (count === 0) {
        responseData.message = '删除成功！'
        responseData.comments = []
        responseData.page = page
        responseData.pages = pages
        res.json(responseData)
        return false
      }
      Comment.find().limit(limit).skip(skip).populate('labels').then(function (comments) {
        responseData.message = '删除成功！'
        responseData.comments = comments
        responseData.page = page
        responseData.pages = pages
        res.json(responseData)
      })
    })
  })
})
// 删除文章
router.get('/comment/delArticle', function (req, res, next) {
  var id = req.query.id
  Content.findOne({
    _id: id
  }).then(function (comment) {
    if (!comment) {
      responseData.code = 2
      responseData.message = '分类不存在！'
      res.json(responseData)
      return Promise.reject()
    } else {
      if (comment.status === 1) {  // 若文章是状态1，则移动至回收站，否则删除
        return Content.update({
          _id: id
        }, {
          status: 2
        })
      }
      return Content.remove({
        _id: id
      }).then(function () {
        return Comment.remove({
          article: id
        })
      })
    }
  }).then(function () {
    responseData.message = '删除文章成功！'
    res.json(responseData)
  })
})

// 添加评论
router.post('/comment/add', function (req, res, next) {
  var commented = ''
  var commentedNames = ''
  var limit = true
  Content.findOne({
    _id: req.body.article
  }).populate('user').then(function (content) {
    var userId = content.user._id
    return Blog.findOne({
      loginId: userId
    }).then(function (blogInfo) {
      commented = blogInfo.email
      commentedNames = blogInfo.name
      limit = blogInfo.emailInfrom
    })
  }).then(function () {
    new Comment({
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      article: req.body.article,
      commented: req.body.commented || commented,
      commentedName: req.body.commentedName || commentedNames || '博主'
    }).save().then(function (newcomment) {
      var to = req.body.commented || commented
      var name = req.body.name
      var commentedName = req.body.commentedName || commentedNames
      var comment = req.body.comment
      var article = req.body.article
      Content.findOne({
        _id: article
      }).then(function (content) {
        content.commentNumber++
        content.save()
        if (limit && commented) {
          console.log('====================')
          transporter.sendMail(mailOptions(to, name, commentedName, comment, article, content.title), function (error, info) {
            if (error) {
              return console.log(error)
            }
          })
        }
      })
      responseData.comments = newcomment
      responseData.message = '保存成功！'
      res.json(responseData)
    })
  })
})

// 邮件发送模板
function mailOptions (to, name, commentedName, comment, articleurl, title) { // title:文章名称
  return {
    from: '1031924189@qq.com', // 发件地址
    to: to, // 收件列表
    subject: 'blog comment replay', // 标题
    // text和html两者只支持一种
    html: `
          <div>
            <p>${commentedName}，您好！</p>
            <p>用户${name}对您在我的博客文章<a style="color: limegreen;" href=${'http://localhost:8080/#/content?article=' + articleurl}>${title}</a>下的评论有新的评论:</p>
            <p>回复如下:</p>
            <p>${comment}</p>
            <p>查看本条详细内容请前往地址：</p>
            <p><a style="color: limegreen;" href=${'http://localhost:8080/#/content?article=' + articleurl}>传送门→→</a></p>
            <p><a href="http://localhost:8080" target="_blank">markdown</a>感谢您的关注。</p>
          </div>
        ` // 内容
  }
}

module.exports = router
