import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueChatScroll from 'vue-chat-scroll'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(VueChatScroll)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

const {ipcRenderer} = require('electron')
const ids = ['casparcg', 'media-scanner']
ids.forEach(id => {
  ipcRenderer.on(id + '.log', (e, data) => {
    store.dispatch('logLine', { id: id, data: JSON.parse(data) })
  })
  ipcRenderer.on(id + '.status', (e, status) => {
    store.dispatch('setStatus', { id, status })
  })
})
