var express = require('express')
var router = express.Router()
var Label = require('../models/label')
var Content = require('../models/content')
var Comment = require('../models/comment')
var Blog = require('../models/blog')
var fs = require('fs')
var path = require('path')

var responseData
router.use(function (req, res, next) {
  responseData = {
    user: req.cookies.get('userInfo') || null,
    code: 0,
    message: '',
    labels: []
  }
  next()
})
// 查寻所有标签
router.post('/label/search', function (req, res, next) {
  Label.find().then(function (label) {
    var all = {
      'labelName': '全部',
      'number': 0,
      '_id': null
    }
    label.forEach(function (item) {
      all.number += item.number
    })
    label.unshift(all)
    responseData.labels = label
    res.json(responseData)
  })
})
// 添加标签名
router.post('/label/add', function (req, res, next) {
  var name = req.body.name || ''
  if (name === '') {
    responseData.code = 1
    responseData.message = '分类名不能为空!!!'
    res.json(responseData)
  }
  Label.findOne({
    labelName: name
  }).then(function (label) {
    if (label) {
      responseData.code = 4
      responseData.message = '分类名重复！'
      responseData.labels = []
      res.json(responseData)
      return false
    } else {
      return new Label({
        labelName: name,
        number: 0
      }).save()
    }
  }).then(function (newLabel) {
    responseData.message = '添加成功！'
    responseData.labels = newLabel
    res.json(responseData)
  })
})

// 修改标签名
router.post('/label/edit', function (req, res, next) {
  var id = req.body.id || ''
  var editLabel = req.body.editLabel || ''
  if (editLabel === '') {
    responseData.code = 1
    responseData.message = '分类名不能为空!!!'
    res.json(responseData)
    return Promise.reject()
  }
  Label.findOne({
    _id: id
  }).then(function (label) {
    if (!label) {
      responseData.code = 2
      responseData.message = '分类不存在！'
      res.json(responseData)
      return Promise.reject()
    } else {
      return Label.findOne({
        _id: {$ne: id},
        labelName: editLabel
      })
    }
  }).then(function (repeat) {
    if (repeat) {
      responseData.code = 4
      responseData.message = '分类名重复！'
      res.json(responseData)
      return Promise.reject()
    } else {
      return Label.update({
        _id: id
      }, {
        labelName: editLabel
      })
    }
  }).then(function () {
    responseData.message = '修改成功！'
    res.json(responseData)
  })
})
// 删除分类名
router.post('/label/remove', function (req, res, next) {
  var id = req.body.id || ''
  Label.findOne({
    _id: id
  }).then(function (label) {
    if (!label) {
      responseData.code = 2
      responseData.message = '分类不存在！'
      res.json(responseData)
      return Promise.reject()
    } else if (label.number) {
      responseData.code = 3
      responseData.message = '分类有文章存在！'
      res.json(responseData)
      return Promise.reject()
    } else if (String(label._id) === '111111111111111111111111') {
      responseData.code = 4
      responseData.message = '默认分类不可删除！'
      res.json(responseData)
      return Promise.reject()
    } else {
      return Label.remove({
        _id: id
      })
    }
  }).then(function () {
    return Label.find().then(function (label) {
      responseData.labels = label
      responseData.message = '删除成功！'
      res.json(responseData)
    })
  })
})
// 保存图片
router.post('/content/saveImg', function (req, res, next) {
  var img = req.body.file
  // 过滤data:URL
  var base64Data = img.replace(/^data:image\/\w+;base64,/, '')
  var dataBuffer = Buffer.from(base64Data, 'base64')
  fs.writeFile(path.resolve(__dirname, '../src/assets/img/image1.png'), dataBuffer, function (err) {
    if (err) {
      res.send(err)
    } else {
      responseData.message = '保存成功'
      res.send(responseData)
    }
  })
})

// 编辑文章
router.post('/article/update', function (req, res, next) {
  Content.findOne({
    _id: req.body.articleId
  }).then(function (content) {
    Content.update({
      _id: req.body.articleId
    }, {
      labels: req.body.label._id,
      title: req.body.title,
      description: req.body.abstract,
      content: req.body.value,
      type: req.body.type
    })
    responseData.message = '更新成功！'
    res.json(responseData)
  })
})

// 编辑文章分类
router.post('/article/updateLabel', function (req, res, next) {
  Content.findOne({
    _id: req.body.articleId
  }).then(function (content) {
    return Content.update({
      _id: req.body.articleId
    }, {
      labels: req.body.label
    })
  }).then(function () {
    return Label.findOne({
      _id: req.body.label
    }).then(function (label) {
      label.number ++
      label.save()
    }).then(function () {
      Label.findOne({
        _id: req.body.oldlabel
      }).then(function (label) {
        label.number --
        label.save()
      })
    })
  }).then(function () {
    responseData.message = '更新成功！'
    res.json(responseData)
  })
})
// 保存文章
router.post('/article/save', function (req, res, next) {
  Label.findOne({
    _id: req.body.label._id
  }).then(function (label) {
    label.number++
    label.save()
  }).then(function () {
    new Content({
      labels: req.body.label._id,
      title: req.body.title,
      description: req.body.abstract,
      content: req.body.value,
      user: req.body.user,
      type: req.body.type
    }).save().then(function (content) {
      responseData.message = '保存成功！'
      res.json(responseData)
    })
  })
})
// 获取所有文章
router.get('/content/search', function (req, res, next) {
  // skip(number) 忽略的条数
  var page = req.query.page || 1  // 当前页
  var limit = 5
  var pages = 0 // 总页数
  var label = null
  var type = null
  if (!req.query.label) {
    label = {$ne: '000000000000000000000000'}
  } else {
    label = req.query.label
  }
  if (!req.query.type || req.query.type === '全部') {
    type = {$ne: '000000000000000000000000'}
  } else {
    type = req.query.type
  }
  Content.find({'status': 1, 'labels': label, 'type': type}).count().then(function (count) {
    pages = Math.ceil(count / limit) || 1
    page = Math.max(page, 1) // 当前页不能小于1页
    page = Math.min(page, pages) // 当前页不能超过总页数
    var skip = (page - 1) * limit
    if (count === 0) {
      responseData.content = []
      responseData.page = page
      responseData.pages = pages
      res.json(responseData)
      return false
    }
    Content.find({
      'status': 1,
      'labels': label,
      'type': type
    }).sort({'addTime': -1}).limit(limit).skip(skip).populate('labels').then(function (content) {
      responseData.content = content
      responseData.page = page
      responseData.pages = pages
      res.json(responseData)
    })
  })
})

// 获取回收站所有文章
router.get('/content/movesearch', function (req, res, next) {
  // skip(number) 忽略的条数
  var page = req.query.page || 1  // 当前页
  var limit = 5
  var pages = 0 // 总页数
  Content.find({'status': 2}).count().then(function (count) {
    pages = Math.ceil(count / limit) || 1
    page = Math.max(page, 1) // 当前页不能小于1页
    page = Math.min(page, pages) // 当前页不能超过总页数
    var skip = (page - 1) * limit
    if (count === 0) {
      responseData.content = []
      responseData.page = page
      responseData.pages = pages
      res.json(responseData)
      return false
    }
    Content.find({'status': 2}).limit(limit).skip(skip).populate('labels').then(function (content) {
      responseData.content = content
      responseData.page = page
      responseData.pages = pages
      res.json(responseData)
    })
  })
})
// 获取热门文章
router.get('/content/hot', function (req, res, next) {
  Content.find({'status': 1}).sort({'view': -1}).limit(6).populate('labels').then(function (content) {
    responseData.content = content
    res.json(responseData)
  })
})
// 获取最新文章
router.get('/content/new', function (req, res, next) {
  Content.find({'status': 1}).sort({'addTime': -1}).limit(3).populate('labels').then(function (content) {
    responseData.content = content
    res.json(responseData)
  })
})
// 关键词查询文章
router.post('/content/keyWord', function (req, res, next) {
  var key = req.body.keyWord
  var reg = new RegExp(key, 'i')
  Content.find({
    'status': 1,
    'content': reg
  }).then(function (content) {
    responseData.content = content
    res.json(responseData)
  }, (error) => {
    console.log(error)
    responseData.code = 2
    responseData.message = '查询失败'
    res.json(responseData)
  })
})

// 获取文章详情
router.get('/content/info', function (req, res, next) {
  var id = req.query.id
  Content.findOne({
    _id: id
  }).populate('labels').then(function (content) {
    console.log(!content)
    if (!content) {
      responseData.code = 2
      responseData.message = '文章不存在！'
      res.json(responseData)
      return Promise.reject()
    } else {
      content.view++
      content.save()
    }
    responseData.content = content
    res.json(responseData)
  }, (err) => {
    console.log(err)
    responseData.code = 2
    responseData.message = '文章不存在！'
    res.json(responseData)
  })
})
// 删除文章到回收站
router.post('/content/move', function (req, res, next) {
  var id = req.body.id || ''
  var page = req.body.page || 1
  var limit = 5
  var pages = 0 // 总页数
  Content.findOne({
    _id: id
  }).then(function (content) {
    if (!content) {
      responseData.code = 2
      responseData.message = '文章不存在！'
      res.json(responseData)
      return Promise.reject()
    } else {
      return Content.update({
        _id: id
      }, {
        status: 2
      }).then(function () {
        Label.findOne({
          _id: content.labels
        }).then(function (label) {
          console.log(label)
          label.number--
          label.save()
        })
      })
    }
  }).then(function () {
    return Content.find({'status': 1}).count().then(function (count) {
      pages = Math.ceil(count / limit)
      page = Math.max(page, 1) // 当前页不能小于1页
      page = Math.min(page, pages) // 当前页不能超过总页数
      var skip = (page - 1) * limit
      if (count === 0) {
        responseData.message = '删除成功！'
        responseData.content = []
        responseData.page = page
        responseData.pages = pages
        res.json(responseData)
        return false
      }
      Content.find({'status': 1}).limit(limit).skip(skip).populate('labels').then(function (content) {
        responseData.message = '删除成功！'
        responseData.content = content
        responseData.page = page
        responseData.pages = pages
        res.json(responseData)
      })
    })
  })
})
// 恢复文章
router.post('/content/reback', function (req, res, next) {
  var id = req.body.id || ''
  var page = req.body.page || 1
  var limit = 5
  var pages = 0 // 总页数
  Content.findOne({
    _id: id
  }).then(function (content) {
    if (!content) {
      responseData.code = 2
      responseData.message = '文章不存在！'
      res.json(responseData)
      return Promise.reject()
    } else {
      return Content.update({
        _id: id
      }, {
        status: 1
      }).then(function () {
        Label.findOne({
          _id: content.labels
        }).then(function (label) {
          label.number++
          label.save()
        })
      })
    }
  }).then(function () {
    return Content.find({'status': 2}).count().then(function (count) {
      pages = Math.ceil(count / limit) || 1
      page = Math.min(page, pages) // 当前页不能超过总页数
      page = Math.max(page, 1) // 当前页不能小于1页
      var skip = (page - 1) * limit
      if (count === 0) {
        responseData.message = '删除成功！'
        responseData.content = []
        responseData.page = page
        responseData.pages = pages
        res.json(responseData)
        return false
      }
      Content.find({'status': 2}).limit(limit).skip(skip).populate('labels').then(function (content) {
        responseData.message = '删除成功！'
        responseData.content = content
        responseData.page = page
        responseData.pages = pages
        res.json(responseData)
      })
    })
  })
})
// 删除文章
router.post('/content/remove', function (req, res, next) {
  var id = req.body.id || ''
  var page = req.body.page || 1
  var limit = 5
  var pages = 0 // 总页数
  Content.findOne({
    _id: id
  }).then(function (content) {
    if (!content) {
      responseData.code = 2
      responseData.message = '分类不存在！'
      res.json(responseData)
      return Promise.reject()
    } else {
      return Content.remove({
        _id: id
      }).then(function () {
        return Comment.remove({
          article: id
        })
      })
    }
  }).then(function () {
    return Content.find({'status': 2}).count().then(function (count) {
      pages = Math.ceil(count / limit)
      page = Math.max(page, 1) // 当前页不能小于1页
      page = Math.min(page, pages) // 当前页不能超过总页数
      var skip = (page - 1) * limit
      if (count === 0) {
        responseData.message = '删除成功！'
        responseData.content = []
        responseData.page = page
        responseData.pages = pages
        res.json(responseData)
        return false
      }
      Content.find({'status': 2}).limit(limit).skip(skip).populate('labels').then(function (content) {
        responseData.message = '删除成功！'
        responseData.content = content
        responseData.page = page
        responseData.pages = pages
        res.json(responseData)
      })
    })
  })
})
// 获取博客配置
router.post('/blog/searchInfo', function (req, res, next) {
  var loginId = req.body.loginId
  Blog.findOne({loginId: loginId}).then(function (blogInfo) {
    if (!blogInfo) {
      responseData.blogInfo = {}
    } else {
      responseData.blogInfo = blogInfo
    }
    responseData.message = '查询成功！'
    res.json(responseData)
  })
})

// 保存博客信息配置
router.post('/blog/info', function (req, res, next) {
  var name = req.body.name
  var email = req.body.email
  var description = req.body.description
  var emailInfrom = req.body.emailInfrom
  var copyright = req.body.copyright
  var loginId = req.body.loginId
  Blog.findOne({loginId: loginId}).then(function (bloginfo) {
    if (!bloginfo) {
      return new Blog({
        name: name,
        email: email,
        description: description,
        emailInfrom: emailInfrom,
        copyright: copyright,
        loginId: loginId
      }).save()
    } else {
      return Blog.update({
        loginId: loginId
      }, {
        name: name,
        email: email,
        description: description,
        emailInfrom: emailInfrom,
        copyright: copyright
      })
    }
  }).then(function () {
    Blog.findOne({loginId: loginId}).then(function (blogInfo) {
      responseData.message = '保存成功'
      responseData.blogInfo = blogInfo
      res.json(responseData)
    })
  })
})

module.exports = router
