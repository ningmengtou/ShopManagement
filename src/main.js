import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

// 导入全局样式表 axios
import './assets/css/global.css'
import axios from 'axios'


// 配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
    // 给axios设置拦截器
axios.interceptors.request.use(config => {
    // console.log(config);
    // 必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
    config.headers.Authorization = window.sessionStorage.getItem('token')
        // 最后需要把 config 返回
    return config
})

// 给vue实例的$http上绑定axios请求方式
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')