<template>
  <div class="panel panel-default">
    <div class="panel-heading">
      <span class="glyphicon glyphicon-tags" style="margin-right: 10px;top: 2px;"></span>
      <span>标签分类</span>
    </div>
    <div class="panel-body">
      <a @click="chooseLabel(label)" v-for="label in labels" href="javascript:;"
         :class="{'active': label.labelName === selectLabel.labelName}" class="blog-list-tag">
        {{label.labelName}} ({{label.number}})
      </a>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import { Ajax, Common } from '../../assets/js/common'
export default {
  name: 'Label',
  props: ['labels'],
  data () {
    return {
      'pageCount': []
    }
  },
  beforeMounted () {
    Ajax.getLabel((data) => {
      this.labels = data.labels
    })
  },
  methods: {
    changePage (page) {
      $('html').animate({scrollTop: 0}, 100)
      this.$emit('changePage', page)
    },
    createPageBtn () {
      for (var i = 1; i <= this.pages; i++) {
        this.pageCount.push(i)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .page_num {
    text-align: center;
  }
  .page_num ul {
    display: inline-block;
  }
  .page_num .active {
    background-color: lightskyblue!important;
  }
</style>
