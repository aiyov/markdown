import Vue from 'vue'
import '../../assets/js/bootstrap'
import { api } from '../../assets/js/url'
import { Ajax, Common } from '../../assets/js/common'
import { directive as onClickaway } from 'vue-clickaway'
import Page from '../page.vue'
import $ from 'jquery'

Vue.component('page', Page)

var articles = {
  label: {
    selected: {'labelName': '全部', '_id': null},
    allLabel: []
  },
  type: {
    selected: '全部',
    allType: ['全部', '原创', '翻译', '转载']
  },
  article: [],
  page: 1,
  pages: 1,
  change: false,
  changeLabelId: '',
  changeingLabelId: '',
  changeArticleLabel: ''
}

export default {
  name: 'article',
  directives: {
    onClickaway: onClickaway
  },
  beforeMount () {
    Ajax.getLabel(this.getLabel)
    this.getPage(this.page)
  },
  methods: {
    chooseLabel (item) {
      this.page = 1
      this.label.selected = item
      this.getPage(this.page)
    },
    chooseType (item) {
      this.page = 1
      this.type.selected = item
      this.getPage(this.page)
    },
    getLabel (data) {
      this.label.allLabel = data.labels
    },
    removeArticle (id) {
      var removeDate = {
        'id': id,
        'page': this.page
      }
      Ajax.post(api.content.move, removeDate, (data) => {
        if (data.code === 0) {
          window.location.reload()
        }
      })
    },
    getPage (page) {
      var data = {}
      data['page'] = page
      data['label'] = this.label.selected._id
      data['type'] = this.type.selected
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
    changeLabel (event, item) {
      this.changeArticleLabel = item._id
      this.changeLabelId = item.labels._id
      var ev = event || window.event
      var parEle = $(ev.target).parents('tr')
      var posTop = parEle.offset().top
      var posHeight = parEle.height()
      this.change = true
      $('.changeLabel').css('top', posTop + posHeight - 200 + 'px')
    },
    chooseChangeingLabel (item, index) {
      this.changeingLabelId = item._id
    },
    makesure () {
      var data = {
        'label': this.changeingLabelId,
        'articleId': this.changeArticleLabel,
        'oldlabel': this.changeLabelId
      }
      Ajax.post(api.article.updateLabel, data, (data) => {
        if (data.code === 0) {
          this.change = false
          window.location.reload()
        }
      })
    },
    hide (event) {
      if (this.change && $(event.target).html() !== '分类') {
        this.change = false
      }
    }
  },
  data () {
    return articles
  }
}
