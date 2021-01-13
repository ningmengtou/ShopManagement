import Vue from 'vue'
import VueRouter from 'vue-router'

// 把原来的路由组件全部按照路由懒加载的方式导入
// import Login from '../components/Login.vue'
// import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
const Login = () =>
    import( /* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () =>
    import( /* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () =>
    import( /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// import Users from '../components/user/Users.vue'
// import Rights from '../components/power/Rights.vue'
// import Roles from '../components/power/Roles.vue'
const Users = () =>
    import( /* webpackChunkName: "users_rights_roles" */ '../components/user/Users.vue')
const Rights = () =>
    import( /* webpackChunkName: "users_rights_roles" */ '../components/power/Rights.vue')
const Roles = () =>
    import( /* webpackChunkName: "users_rights_roles" */ '../components/power/Roles.vue')

// import Cate from '../components/goods/Cate.vue'
// import Params from '../components/goods/Params.vue'
const Cate = () =>
    import( /* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
const Params = () =>
    import( /* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

// import List from '../components/goods/List.vue'
// import Add from '../components/goods/Add.vue'
const List = () =>
    import( /* webpackChunkName: "list_add" */ '../components/goods/List.vue')
const Add = () =>
    import( /* webpackChunkName: "list_add" */ '../components/goods/Add.vue')

// import Order from '../components/order/Order.vue'
// import Report from '../components/report/Report.vue'
const Order = () =>
    import( /* webpackChunkName: "order_report" */ '../components/order/Order.vue')
const Report = () =>
    import( /* webpackChunkName: "order_report" */ '../components/report/Report.vue')

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
                { path: '/categories', component: Cate },
                { path: '/params', component: Params },
                { path: '/goods', component: List },
                { path: '/goods/add', component: Add },
                { path: '/orders', component: Order },
                { path: '/reports', component: Report },
            ]
        }
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