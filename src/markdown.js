// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.config.productionTip = false

/* eslint-disable no-new */
// use
Vue.use(mavonEditor)
new Vue({
  'el': '#app',
  data () {
    return { value: '' }
  }
})
