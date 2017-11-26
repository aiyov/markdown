import {StorageUtil} from '../../assets/js/Auth'
import Router from '../../router/index'
import {Ajax} from '../../assets/js/common'

var adminMenu = {
  'login': null,
  'blogInfo': [],
  'adminMenu': [
    {'path': '/article', 'value': '文章管理', 'isActive': false},
    {'path': '/comment', 'value': '评论管理', 'isActive': false},
    {'path': '/label', 'value': '类别管理', 'isActive': false},
    {'path': '/set', 'value': '博客配置', 'isActive': false},
    {'path': '/draft', 'value': '草稿箱', 'isActive': false},
    {'path': '/reback', 'value': '回收站', 'isActive': false}
  ]
}
export default {
  name: 'admin',
  data () {
    return adminMenu
  },
  beforeMount () {
    this.login = StorageUtil.getObject('userInfo')
    if (!this.login) {
      Router.push('/')
    }
    Ajax.getBlogInfo(this.login.id, (data) => {
      data = data.blogInfo
      this.blogInfo = data
    })
  },
  mounted () {
    this.adminMenu.forEach(function (item) {
      if (window.location.hash === '#' + item.path) {
        item.isActive = true
      } else {
        item.isActive = false
      }
    })
  },
  methods: {
    changeFocus (menu) {
      for (var i = 0; i < this.adminMenu.length; i++) {
        this.adminMenu[i].isActive = false
      }
      menu.isActive = true
    },
    loginOut () {
      Ajax.loginOut()
    }
  }
}
