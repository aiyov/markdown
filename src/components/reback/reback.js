import Vue from 'vue'
import { api } from '../../assets/js/url'
import { Ajax, Common } from '../../assets/js/common'
import Page from '../page.vue'

Vue.component('page', Page)
var articles = {
  article: [],
  page: 1,
  pages: 1
}
export default {
  name: 'reback',
  beforeMount () {
    this.getPage(this.page)
  },
  methods: {
    // 获取回收站的文章
    getPage (page) {
      Ajax.get(api.content.movesearch, {'page': page}, (data) => {
        this.article = data.content.map(function (item) {
          var time = new Date(item.addTime)
          item.addTime = Common.getTime(time)
          return item
        })
        this.page = data.page
        this.pages = data.pages
      })
    },
    // 切底删除文章
    delPage (id) {
      Ajax.post(api.content.remove, {'page': this.page, 'id': id}, (data) => {
        this.article = data.content.map(function (item) {
          var time = new Date(item.addTime)
          item.addTime = Common.getTime(time)
          return item
        })
        this.page = data.page
        this.pages = data.pages
      })
    },
    // 恢复文章
    rebackPage (id) {
      Ajax.post(api.content.reback, {'page': this.page, 'id': id}, (data) => {
        this.article = data.content.map(function (item) {
          var time = new Date(item.addTime)
          item.addTime = Common.getTime(time)
          return item
        })
        this.page = data.page
        this.pages = data.pages
      })
    }
  },
  data () {
    return articles
  }
}
