import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 添加全局样式
import './assets/css/global.css'
//引入element插件
import './plugins/element.js'
//引入iconfont图标
import './assets/font/iconfont.css'
//导入axios
import axios from 'axios'


//挂载axios
Vue.prototype.$http = axios
axios.defaults.baseURL = "http://localhost:9001"


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
