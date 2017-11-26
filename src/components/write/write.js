import Vue from 'vue'
import $ from 'jquery'
// import '../../assets/css/bootstrap.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import Router from '../../router/index'
import { StorageUtil } from '../../assets/js/Auth'
import { Ajax } from '../../assets/js/common'
import { api } from '../../assets/js/url'

Vue.config.productionTip = false

/* eslint-disable no-new */
// use
Vue.use(mavonEditor)

export default {
  name: 'write',
  beforeMount () {
    if (!StorageUtil.getObject('userInfo')) {
      Router.push('/')
    }
    /* if (this.$route.query.articleId) {
      var articleId = this.$route.query.articleId
      Ajax.getArticleInfo(articleId, (data) => {
        if (data.code !== 0) {
          alert('获取文章失败!!!')
          Router.push('/main')
        }
        this.article.value = data.content // 文章内容
        this.article.title = data.title // 文章标题
        this.article.abstract = data.description // 摘录
        this.article.label = data.labels.labelName // 添加标签
        this.article.type = data.type
      })
    } */
  },
  mounted () {
    // this.getLabel()
    Ajax.getLabel((data) => {
      data.labels.shift()
      this.commandlabel = data.labels
      this.article.label = this.commandlabel[0]
      this.article.type = this.writeType[0]
    })
  },
  methods: {
    saveArticle () {
      if (!this.article.abstract) {
        alert('摘要不能为空!!!')
        return false
      }
      Ajax.post(api.article.save, this.article, (data) => {
        if (data.code === 0) {
          this.value = ''
          this.article.value = '' // 文章内容
          this.article.title = '' // 文章标题
          this.article.abstract = '' // 摘录
          this.send = !this.send
        }
      })
    },
    addLabel () {
      if (!this.value || !this.article.title) {
        alert('题目或内容不能为空')
        return false
      }
      this.send = !this.send
    },
    // getLabel () {
    //   $.post('/admin/label/search', (data) => {
    //     data.labels.shift()
    //     this.commandlabel = data.labels
    //     this.article.label = this.commandlabel[0]
    //     this.article.type = this.writeType[0]
    //   })
    // },
    chooseLabel (item) {
      this.article.label = item
    },
    chooseType (item) {
      this.article.type = item
    },
    htmlcode (val, htmlvalue) {
      this.article.value = htmlvalue
    }
  },
  data () {
    return {
      login: StorageUtil.getObject('userInfo'),
      markedValue: '',
      article: {
        value: '', // 文章内容（markdown格式）
        title: '', // 文章标题
        abstract: '', // 摘录
        label: '', // 添加标签
        type: '',
        user: StorageUtil.getObject('userInfo').id
      },
      commandlabel: [], // 推荐标签
      writeType: ['原创', '转载', '翻译'],
      send: false,
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      }
    }
  }
}
