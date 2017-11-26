import Vue from 'vue'
import Router from 'vue-router'
import route from './index.js'
import { StorageUtil } from '../assets/js/Auth'
import Index from '../components/index/index.vue'
import Login from '../components/login/login.vue'
import Admin from '../components/admin/admin.vue'
import Article from '../components/article/article.vue'
import Comment from '../components/comment/comment.vue'
import Label from '../components/label/label.vue'
import Set from '../components/set/set.vue'
import Draft from '../components/draft/draft.vue'
import Reback from '../components/reback/reback.vue'
import Write from '../components/write/write.vue'
import Content from '../components/content/content.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: Index,
      redirect: '/main'
    }, {
      path: '/main',
      name: 'main',
      component: Index
    }, {
      path: '/login',
      name: 'login',
      component: Login
    }, {
      path: '/write',
      name: 'write',
      component: Write
    }, {
      path: '/content',
      name: 'content',
      component: Content
    }, {
      path: '/admin',
      name: 'admin',
      component: Admin,
      beforeEnter: (to, from, next) => {
        const user = StorageUtil.getObject('userInfo')
        if (!user) {
          route.push('/main')
        } else {
          next()
        }
      },
      redirect: '/article',
      children: [
        {
          path: '/article',
          name: 'article',
          component: Article
        }, {
          path: '/comment',
          name: 'comment',
          component: Comment
        }, {
          path: '/label',
          name: 'label',
          component: Label
        }, {
          path: '/set',
          name: 'set',
          component: Set
        }, {
          path: '/draft',
          name: 'draft',
          component: Draft
        }, {
          path: '/reback',
          name: 'reback',
          component: Reback
        }
      ]
    }
  ]
})
