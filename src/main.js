import Vue from 'vue'
import { Button } from 'element-ui'
import App from './App.vue'
import '@/styles/reset.scss'
import '@/styles/global.scss'

Vue.config.productionTip = false

Vue.use(Button)

new Vue({
  render: h => h(App),
}).$mount('#app')
