import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/:id',
      name: 'process-page',
      component: require('@/components/ProcessTab').default
    },
    {
      path: '*',
      redirect: '/casparcg'
    }
  ]
})
