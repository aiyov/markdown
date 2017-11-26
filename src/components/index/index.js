/**
 * Created by Administrator on 2017/10/26.
 */
import '../../assets/css/bootstrap.css'
import { Ajax, Common } from '../../assets/js/common'
import { StorageUtil } from '../../assets/js/Auth'
import { api } from '../../assets/js/url'
import Vue from 'vue'
import BlogTitle from '../title.vue'
import Search from '../search.vue'

Vue.component('blogtitle', BlogTitle)
Vue.component('search', Search)

var store = {
  'selectLabel': {'labelName': '全部', '_id': null},
  'labels': [],
  'article': [],
  'hotArticle': [],
  'comments': [],
  'login': null,
  'page': 1,
  'pages': 1
}
export default {
  name: 'index',
  beforeMount () {
    Ajax.getLabel(this.getLabels)
    this.getPage(this.page)
    Ajax.getHotArticle((data) => {
      this.hotArticle = data.content
    })
    this.getComments()
  },
  methods: {
    getLabels (data) {
      this.labels = data.labels
      this.login = StorageUtil.getObject('userInfo')
    },
    getPage (page) {
      var data = {}
      data['page'] = page
      data['label'] = this.selectLabel._id
      Ajax.getArticle(data, (data) => {
        this.article = data.content.map(function (item) {
          var time = new Date(item.addTime)
          item.addTime = Common.getTime(time)
          return item
        })
        this.page = data.page
        this.pages = data.pages
      })
    },
    getComments () {
      Ajax.post(api.comment.getNew, null, (data) => {
        this.comments = data.comments.map(function (item) {
          var time = new Date(item.addTime)
          item.addTime = Common.getTime(time)
          return item
        })
      })
    },
    chooseLabel (item) {
      if (this.selectLabel === item) {
        return false
      }
      this.page = 1
      this.selectLabel = item
      this.getPage(this.page)
    },
    loginOut () {
      Ajax.loginOut()
    }
  },
  data () {
    return store
  }
}
