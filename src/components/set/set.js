import { Ajax } from '../../assets/js/common'
import { api } from '../../assets/js/url'
import { StorageUtil } from '../../assets/js/Auth'
export default {
  name: 'set',
  beforeMount () {
    Ajax.getBlogInfo(this.blog.loginId, (data) => {
      data = data.blogInfo
      if (!data.emailInfrom) {
        return false
      } else {
        this.blog.name = data.name
        this.blog.email = data.email
        this.blog.description = data.description
        this.blog.emailInfrom = data.emailInfrom
        this.blog.copyright = data.copyright
      }
    })
  },
  methods: {
    changeInfo () {
      if (!this.isEmail(this.blog.email)) {
        alert('请检查邮箱格式!')
        return false
      }
      if (!this.blog.email && this.blog.emailInfrom) {
        alert('请检查邮箱格式!')
        return false
      }
      Ajax.post(api.blog.info, this.blog, (data) => {
        if (data.code === 0) {
          this.updataReasult = true
          setTimeout(function () {
            window.location.reload()
          }, 800)
          return true
        }
        this.updataReasult = false
      })
    },
    isEmail (str) {
      if (!str) {
        return true
      }
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      return reg.test(str)
    },
    inFrom (num) {
      this.blog.emailInfrom = Boolean(num)
    }
  },
  data () {
    return {
      blog: {
        'name': '',
        'email': '',
        'description': '',
        'emailInfrom': true,
        'loginId': StorageUtil.getObject('userInfo').id,
        'copyright': {
          'onOff': true,
          'info': '本文为博主原创文章，未经博主允许不得转载。'
        }
      },
      updataReasult: ''
    }
  }
}
