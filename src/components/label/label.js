import $ from 'jquery'
import { Ajax } from '../../assets/js/common'
import { api } from '../../assets/js/url'

var dataLabel = {
  'label': [],
  'newLabel': {
    'name': ''
  },
  'addResult': '',
  'changeResult': ''
}
export default {
  name: 'label',
  data () {
    return dataLabel
  },
  props: ['+this.addResult+'],
  mounted () {
    Ajax.getLabel(this.getLabel)
  },
  methods: {
    getLabel (data) {
      this.label = data.labels.map(function (item) {
        item['isEdit'] = false
        return item
      })
    },
    addLabel () { // 增加分类名
      Ajax.post(api.label.add, this.newLabel, (data) => {
        this.newLabel.name = ''
        this.addResult = data.message
        if (data.code === 0) {
          data.labels['isEdit'] = false
          this.label.push(data.labels)
        }
      })
    },
    editLable (item, index) { // 编辑分类名
      var onOff = false // 默认无正在编辑的分类名
      var _this = this
      this.label.forEach(function (el, index) {
        if (el.isEdit === true) {
          onOff = true
          alert('有未保存的分类名')
          _this.$nextTick(function () { // DOM 现在更新了 this` 绑定到当前实例
            $('.lableName').eq(index).focus()
          })
        }
      })
      if (!onOff) {
        item['isEdit'] = true
        this.$nextTick(function () {
          $('.lableName').eq(index).focus()
        })
      }
    },
    saveLable (item, index) { // 保存修改的分类名
      var data = {
        'id': item._id,
        'editLabel': item.labelName
      }
      Ajax.post(api.label.edit, data, (data) => {
        if (data.code !== 0) {
          item.labelName = ''
          this.changeResult = data.message
          this.$nextTick(function () {
            $('.lableName').eq(index).focus()
          })
        } else {
          item['isEdit'] = false
        }
      })
    },
    removeLabel (item) {
      var data = {
        'id': item._id
      }
      Ajax.post(api.label.remove, data, (data) => {
        if (data.code !== 0) {
          alert(data.message)
        } else {
          this.label = data.labels.map(function (item) {
            item['isEdit'] = false
            return item
          })
        }
      })
    }
  }
}
