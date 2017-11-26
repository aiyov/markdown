<template>
  <div class="search"  v-show="search">
    <div class="searchContent" v-on-clickaway="close">
      <div class="header">
        <span class="glyphicon glyphicon-search"></span>
        <div class="searchWrapper">
          <input type="text" v-model="keyCode" @input="searchArticle" placeholder="搜索。。。" />
        </div>
        <span class="glyphicon glyphicon-remove-sign" @click="close"></span>
      </div>
      <div class="reasultWrapper">
        <ul class="list-group">
          <li class="list-group-item" v-if="!article.length">
            <p>暂无相关信息。。。</p>
          </li>
          <li class="list-group-item" v-for="item, index in article">
            <h5>
              {{index+1}}.
              <router-link :to="{ name: 'content', query: { article: item._id }}">
                {{item.title}}
              </router-link>
            </h5>
            <p>{{item.content}}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Bus from '../assets/js/bus'
  import { Ajax } from '../assets/js/common'
  import { api } from '../assets/js/url'
  import '../assets/css/bootstrap.css'
  import { directive as onClickaway } from 'vue-clickaway'
  export default {
    name: 'Search',
    directives: {
      onClickaway: onClickaway
    },
    mounted () {
      Bus.$on('find', () => {
        setTimeout(() => {
          this.search = true
        }, 200)
      })
    },
    methods: {
      searchArticle () {
        if (!this.keyCode && !this.keyCode.trim()) {
          this.article = []
          return false
        }
        Ajax.post(api.content.keyWord, {'keyWord': this.keyCode}, (data) => {
          this.article = data.content
        })
      },
      come () {
        this.search = true
      },
      close () {
        this.search = false
      }
    },
    data () {
      return {
        search: false,
        keyCode: '',
        article: []
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  p {
    margin: 0;
  }
  .search {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    z-index: 20;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .searchContent {
    width: 700px;
    height: 80%;
    background: rgba(250, 250, 250, 1);
    border-radius: 5px;
    position: relative;
  }
  
  .header {
    padding: 5px;
    height: 36px;
    line-height: 36px;
    background: #f5f5f5;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  
  .searchWrapper {
    vertical-align: middle;
    display: inline-block;
    width: calc(100% - 50px);
    padding: 0 5px;
  }
  .searchWrapper span {
    vertical-align: middle;
  }
  .searchWrapper input {
    width: 100%;
    height: 26px;
    border: none;
    padding: 0;
    vertical-align: top;
    outline: none;
  }
  .reasultWrapper {
    width: 100%;
    position: absolute;
    top: 36px;
    bottom: 0;
    overflow: auto;
  }
  .list-group-item {
    text-decoration: dotted!important;
    list-style: circle!important;
    border: none;
    border-radius: 0;
    border-bottom: 1px dashed #3c3c3c;
  }
  .list-group-item h5 a{
    font-weight: bold;
    color: #3c3c3c;
    text-decoration: underline;
    text-decoration-color: #ccc;
  }
  .list-group-item a:hover {
    text-decoration-color: #333;
  }
</style>
