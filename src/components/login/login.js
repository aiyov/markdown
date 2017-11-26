import $ from 'jquery'
import Router from '../../router/index'
import { Ajax } from '../../assets/js/common'
import { api } from '../../assets/js/url'
import { StorageUtil } from '../../assets/js/Auth'

export default {
  name: 'login',
  data () {
    return {
      'username': '',
      'password': '',
      'showLogin': true,
      'showTips': ''
    }
  },
  methods: {
    changeShow () {
      this.showLogin = !this.showLogin
    },
    sign () {
      var _this = this
      $.ajax({
        type: 'post',
        url: '/api/user/register',
        dataType: 'json',
        data: {
          'username': _this.username,
          'password': _this.password
        },
        success: function (data) {
          if (data.code) { // 注册失败
            _this.username = ''
            _this.password = ''
            _this.showTips = data.message
          } else {
            console.log(12312312122312)
          }
        }
      })
    },
    login () {
      var _this = this
      $.ajax({
        type: 'post',
        url: '/api/user/login',
        dataType: 'json',
        data: {
          'username': _this.username,
          'password': _this.password
        },
        success: function (data) {
          if (data.code) { // 登录失败
            _this.username = ''
            _this.password = ''
            _this.showTips = data.message
          } else {
            StorageUtil.storeObject('userInfo', data.userInfo)
            Router.push('/')
          }
        }
      })
    }
  }
}
