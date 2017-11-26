import $ from 'jquery'
import Vue from 'vue'
import {Ajax} from '../../assets/js/common'
import {api} from '../../assets/js/url'
import Page from '../page.vue'
Vue.component('page', Page)
export default {
  name: 'adminuser',
  data () {
    return {
      users: [],
      page: 1,
      pages: 1
    }
  },
  mounted () {
    this.getUsers(this.page)
  },
  methods: {
    getUsers (page) {
      Ajax.get(api.user.search, {'page': page}, (data) => {
        this.users = data.users
        this.page = data.page
        this.pages = data.pages
      })
    }
  }
}
