<template>
  <div class="container">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">
            <span>BUG</span>
            <span class="smallTitle">shout</span>
          </a>

          <form class="navbar-form navbar-left">
            <div class="form-group">
              <input type="text" class="form-control" placeholder="Search" @focus="searchArticle">
            </div>
          </form>
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav navbar-right">
            <li>
              <router-link :to="'/main'">
                <span class="glyphicon glyphicon-home"></span>
                <span>首页</span>
              </router-link>
            </li>
            <li>
              <a href="#">
                <span class="glyphicon glyphicon-user"></span>
                <span>关于</span>
              </a>
            </li>
            <li v-if="login">
              <router-link v-bind:to="'/admin'">{{login.username}}</router-link>
            </li>
            <li v-if="login">
              <a href="#" @click="loginOut">退出</a>
            </li>
          </ul>
        </div><!-- /.navbar-collapse -->
      </div><!-- /.container-fluid -->
    </nav>
  </div>
</template>

<script>
  import Bus from '../assets/js/bus'
  import { Ajax } from '../assets/js/common'
  import '../assets/css/bootstrap.css'

  export default {
    name: 'BlogTitle',
    props: ['login'],
    methods: {
      loginOut () {
        Ajax.loginOut()
      },
      searchArticle () {
        Bus.$emit('find')
      }
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header .navbar {
    height: 70px;
    margin-bottom: 0 !important;
    background: ghostwhite !important;
    border: none !important;
  }

  .navbar > div {
    margin-top: 8px;
  }

  .navbar-brand {
    font-size: 40px !important;
    font-family: "Droid Sans Mono Dotted";
  }

  .smallTitle {
    font-size: 10px !important;
    margin-left: -12px;
  }

  @media (max-width: 768px) {
    .navbar-left {
      float: left !important;
      border: none !important;
      padding-top: 0 !important;
    }
  }
</style>
