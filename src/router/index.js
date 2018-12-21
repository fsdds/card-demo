import Vue from 'vue'
import Router from 'vue-router'
import AppPayment from '@/components/AppPayment'
import 'normalize.css'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AppPayment',
      component: AppPayment
    }
  ]
})
