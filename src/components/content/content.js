/**
 * Created by Administrator on 2017/10/26.
 */
import '../../assets/css/bootstrap.css'
import marked from 'marked'
import { Ajax, Common } from '../../assets/js/common'
import { StorageUtil } from '../../assets/js/Auth'
import { api } from '../../assets/js/url'
import router from '../../router/index'
import Vue from 'vue'
import BlogTitle from '../title.vue'
import $ from 'jquery'

Vue.component('blogtitle', BlogTitle)
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: true,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

var store = {
  'user': '',
  'labels': [],
  'article': [],
  'hotArticle': [],
  'newArticle': [],
  'comment': [],
  'login': null,
  'newComment': {
    'comment': '',
    'name': '',
    'email': '',
    'article': '',
    'commented': '', // 被评论的邮箱
    'commentedName': '' // 被评论的昵称
  }
}
export default {
  name: 'index',
  beforeMount () {
    this.user = StorageUtil.getObject('userInfo')
    this.newComment.article = this.$route.query.article
    this.article.article = this.$route.query.article
    Ajax.getLabel(this.getLabels)
    Ajax.getArticleInfo(this.$route.query.article, (data) => {
      if (data.code !== 0) {
        alert('获取文章失败!!!')
        router.push('/main')
      }
      Ajax.getHotArticle((data) => {
        this.hotArticle = data.content
      })
      var time = new Date(data.content.addTime)
      data.content.addTime = Common.getTime(time)
      // console.log(data.content.)
      // data.content.content = marked(data.content.content)
      this.article = data.content
    })
    Ajax.get(api.content.newSearch, null, (data) => {
      this.newArticle = data.content
    })
    this.getCommet()
  },
  methods: {
    getLabels (data) {
      this.labels = data.labels
      this.login = StorageUtil.getObject('userInfo')
    },
    getCommet () { //  获取文章所有的评论
      Ajax.post(api.comment.get, {'id': this.$route.query.article}, (data) => {
        this.comment = data.comments.map(function (item) {
          var time = new Date(item.addTime)
          item.addTime = Common.getTime(time).split(' ')[0]
          return item
        })
      })
    },
    addComment () { // 添加评论
      if (this.newComment.comment === '' || this.newComment.name === '' || this.newComment.email === '') {
        alert('内容，昵称，邮箱不能为空!!!')
        return false
      }
      if (!this.isEmail(this.newComment.email)) {
        alert('请确认邮箱格式!!!')
        return false
      }
      Ajax.post(api.comment.add, this.newComment, (data) => {
        this.newComment.comment = ''
        this.newComment.name = ''
        this.newComment.email = ''
        var newdata = data.comments
        var time = new Date(newdata.addTime)
        newdata.addTime = Common.getTime(time).split(' ')[0]
        this.comment.push(newdata)
      })
    },
    delComment (id, index) {
      Ajax.get(api.comment.del, {'id': id}, (data) => {
        if (data.code === 0) {
          this.comment.splice(index, 1)
          console.log(this.comment)
        }
      })
    },
    commented (item) { // 添加被评论人的信息
      this.newComment.commentedName = item.name
      this.newComment.commented = item.email
    },
    delCommented () { // 设置被评论人为默认
      this.newComment.commentedName = ''
      this.newComment.commented = ''
    },
    removeArticle (id) {
      var removeDate = {
        'id': id
      }
      Ajax.get(api.comment.delArticle, removeDate, (data) => {
        if (data.code === 0) {
          router.push('/')
        }
      })
    },
    reload () {
      window.location.reload()
    },
    goTop () {
      $('html').animate({scrollTop: 0}, 500)
    },
    isEmail (str) {
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      return reg.test(str)
    }
  },
  data () {
    return store
  }
}
