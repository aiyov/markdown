/**
 * Created by Administrator on 2017/11/8.
 */
import { StorageUtil } from '../../assets/js/Auth'
import { api } from '../../assets/js/url'
import Router from '../../router/index'

var Ajax = {
  getLabel (fn) {
    $.post(api.label.search, function (data) {
      data.user = JSON.parse(data.user)
      StorageUtil.storeObject('userInfo', data.user)
      fn(data)
    })
  },
  getArticle (data,fn) {
    $.get(api.content.search, data, (data) => {
      fn(data)
    })
  },
  getHotArticle (fn) {
    $.get(api.content.hotSearch, (data) => {
      fn(data)
    })
  },
  getArticleInfo (id, fn) {
    $.get(api.content.info,{'id': id}, (data) => {
      fn(data)
    })
  },
  getBlogInfo(id, fn) {
    $.post(api.blog.searchInfo, {'loginId': id}, function (data) {
      fn(data)
    })
  },
  post (url, data, fn) {
    $.post(url, data, function (data) {
      if (!data.user) {
        StorageUtil.removeObject('userInfo')
      }
      data.user = JSON.parse(data.user)
      StorageUtil.storeObject('userInfo', data.user)
      fn(data)
    })
  },
  get (url, data, fn) {
    console.log()
    $.get(url, data, function (data) {
      if (!data.user) {
        StorageUtil.removeObject('userInfo')
      }
      data.user = JSON.parse(data.user)
      StorageUtil.storeObject('userInfo', data.user)
      fn(data)
    })
  },
  loginOut () {
    $.get(api.user.loginOut, function () {
      StorageUtil.removeObject('userInfo')
      window.location.reload()
    })
  }
}
var Common = {
  getTime (Time) {
    var time = new Date(Time)
    var y = time.getFullYear()
    var m = Number(time.getMonth()) + 1
    var d = time.getDate()
    var h = time.getHours()
    var min = time.getMinutes()
    var s = time.getSeconds()
    return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s
  },
  limit (str) {
    var reg = /[<|>|-|'|'|"|"]/
    return str.replace(reg, function () {
      return ''
    })
  }
}
export { Ajax, Common}
