<template>
  <div class="page_num" v-if="page!==0">
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li v-show="page != 1" @click="changePage(page-1)">
          <a href="javascript:;" aria-label="Previous">
            <span aria-hidden="true">上一页</span>
          </a>
        </li>
        <li v-for="item in pages" @click="changePage(item)"><a :class="{active: page==item}" href="javascript:;">{{item}}</a></li>
        <li  v-show="pages != 1 && page != pages">
          <a href="javascript:;" aria-label="Next" @click="changePage(page+1)">
            <span aria-hidden="true">下一页</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'Page',
  props: ['page', 'pages'],
  data () {
    return {
      'pageCount': []
    }
  },
  beforeMounted () {
    this.createPageBtn()
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
