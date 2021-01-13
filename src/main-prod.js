import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'

// 导入全局样式表 axios
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// 导入tabletree插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入进度条包和对应的样式
import NProgress from 'nprogress'





// 配置请求的根路径
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
    // 给axios设置拦截器 在request拦截器中展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
    // console.log(config);
    // 展示进度条
    NProgress.start()
        // 必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
    config.headers.Authorization = window.sessionStorage.getItem('token')
        // 最后需要把 config 返回
    return config
})

// 在response拦截器中隐藏进度条  NProgress.done()
axios.interceptors.response.use(config => {
    // 隐藏进度条
    NProgress.done()
    return config
})


// 给vue实例的$http上绑定axios请求方式
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 全局注册组件TreeTable
Vue.component('tree-table', TreeTable)
    // 全局注册组件富文本编辑器
Vue.use(VueQuillEditor)

// 创建全局过滤器
Vue.filter('dateFormat', function(value) {
    // 使用 new Date() 获取到时间轴
    const dt = new Date(value)
        // padStart() 是字符串方法 不足两位就用‘0’替代

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDay() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')

    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')