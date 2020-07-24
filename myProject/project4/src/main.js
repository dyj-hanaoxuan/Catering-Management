import Vue from 'vue'
import App from './App.vue'
import router from './router'
import dongRouter from './router/dongRouter'
import store from './store'
import Axios from 'axios'
import Echars from 'echarts'
import './plugins/element.js'

Vue.prototype.$axios = Axios
Vue.prototype.$echars = Echars
Vue.config.productionTip = false
// 路由前置守卫（权限判断：判断对应路由是否登录，保证有些组件必须要在登录状态下才能显示）
router.beforeEach(function (to,from,next) {
    // 如果用户去登录路由，则直接next
    if(to.name === 'Login'){
        next()
    }else {
        // 判断用户是否登录
        if(to.meta.requireAuth){
            // 如果登录
            if(sessionStorage.getItem('isLogin')){
                console.log('路由守卫打印')
              console.log(sessionStorage.getItem('isLogin'))
                // 如果用户登录且刷新界面了，则重新添加动态路由
                if(store.getters.getIsLogin && store.getters.getIsRefresh){
                    store.dispatch('setNoRefresh')  // 改变刷新的状态，设为false，调用setNoRefresh
                    dongRouter.DynamicAddRouter() // 添加动态路由的方法
                    next({ ...to, replace: true })
                }else {
                    next()
                }
            }else {
                next({
                    path: '/Login'
                })
            }
        }else {
            if (store.getters.getIsRefresh) {
                console.log('加载动态路由')
                store.dispatch('setNoRefresh') // 重新刷新设置为false
                dongRouter.DynamicAddRouter() // 添加动态路由的方法
                next({ ...to, replace: true })
            } else {
                next()
            }
        }
    }
})
// 添加请求拦截器，在请求头中加token
Axios.interceptors.request.use(
    config => {
        if (sessionStorage.getItem('token')) {
            config.headers.Authorization = sessionStorage.getItem('token');
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    });
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
