import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'





Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            redirect: '/users',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/users', component: Users },
                { path: '/rights', component: Rights },
                { path: '/roles', component: Roles },

            ]
        },

    ]
})

// 挂载路由导航守卫
router.beforeEach((to, form, next) => {
    //     // to 将要访问的路径
    //     // form 从哪个路径跳转而来
    //     // next 放行函数   next('路径')可以是强制跳转

    if (to.path === '/login') return next();
    // 从session中获取 token 令牌 有令牌则放行继续访问,没有则返回到login页面
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})

export default router