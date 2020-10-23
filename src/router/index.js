import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'


Vue.use(VueRouter)

const router = new VueRouter({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home},

  ]
})

// 挂载路由导航守卫
// router.beforeEach((to,form,next) => {
//     // to 将要访问的路径
//     // form 从哪个路径跳转而来
//     // next 放行函数 next('路径')可以是强制跳转

//     // if (to.path === '/login') return next()
//     // const tokenStr = window.sessionStorage.getItem('token')
//     // if (!tokenStr) return next('/login')
//     // next()
// })

export default router
