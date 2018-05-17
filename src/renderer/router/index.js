import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/components/LandingPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

const {ipcRenderer} = require('electron')
window.blah = ipcRenderer
ipcRenderer.on('ccg.log', function (store, data) {
  console.log(store, data.toString())
})

ipcRenderer.on('scanner.log', function (store, data) {
  console.log(store, data.toString())
})
