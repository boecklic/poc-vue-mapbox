import Vue from 'vue'
import Vuex from 'vuex'
import VueResource from 'vue-resource'
import App from './App.vue'
import store from './store'

// load plugins
Vue.use(Vuex)

Vue.config.productionTip = false

Vue.use(VueResource)
Vue.http.interceptors.push((request, next) => {
  request.headers.set('Referer', 'tileserver.ltboc.infra.bgdi.ch')
  next()
})

new Vue({
  // provide the store using the "store" option.
  // this will inject the store instance to all child components.
  store,
  render: h => h(App)
}).$mount('#app')
