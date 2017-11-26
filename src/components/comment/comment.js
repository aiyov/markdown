import { Ajax, Common } from '../../assets/js/common'
import { api } from '../../assets/js/url'
import Vue from 'vue'
import BlogTitle from '../title.vue'
Vue.component('blogtitle', BlogTitle)
var comments = {
  'comments': [],
  'page': 1,
  'pages': 1
}

export default {
  name: 'comment',
  beforeMount () {
    this.getComments(this.page)
  },
  methods: {
    getComments (page) {
      Ajax.get(api.comment.getAll, {'page': page}, (data) => {
        this.comments = data.comments.map(function (item) {
          var time = new Date(item.addTime)
          item.addTime = Common.getTime(time)
          return item
        })
        this.page = data.page
        this.pages = data.pages
      })
    },
    removeArticle (id) {
      var removeDate = {
        'id': id,
        'page': this.page
      }
      Ajax.post(api.comment.remove, removeDate, (data) => {
        this.comments = data.comments.map(function (item) {
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
    return comments
  }
}
