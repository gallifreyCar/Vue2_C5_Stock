import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入login组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'

import InStock from '../components/admin/InStock'
import OutStock from '../components/admin/OutStock'
import Stock from '../components/admin/Stock'
import Customer from '../components/admin/Customer'
import Provider from '../components/admin/Provider'
import Stockhouse from '../components/admin/StockHouse'
import Goods from '../components/admin/Goods'

Vue.use(VueRouter)

build: {
  assetsPublicPath: '/c5_stock/'
}


const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    component: Login
  },
  {
    path: "/home",
    component: Home,
    redirect: "/in_stock",
    children: [
      { path: "/in_stock", component: InStock },
      { path: "/out_stock", component: OutStock },
      { path: "/stock", component: Stock },
      { path: "/customer", component: Customer },
      { path: "/provider", component: Provider },
      { path: "/goods", component: Goods },
      { path: "/stockhouse", component: Stockhouse },


    ]
  }

]

const router = new VueRouter({
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的      即将访问的路由
  // from 从哪里访问    即将离开的路由
  // next将要干的事情   是否准许通行
  // next(url)重定向          重定向
  // next()   继续访问to路径  放行    

  if (to.path == "/login") return next();
  //获取user
  const userFlag = window.sessionStorage.getItem("user");// 取出当前用户
  if (!userFlag) return next('/login');//无值返回登录页面
  next();// 符合要求 放行

})

export default router
