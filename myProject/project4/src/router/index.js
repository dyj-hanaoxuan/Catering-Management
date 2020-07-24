import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import login from '../views/login.vue'
import index from '../views/index.vue'
import personal from '../views/personal.vue'
Vue.use(Router)
var router = new Router({
    routes:[
        {
            path: '/',
            redirect: '/Login'
        },
        {
            path: '/Login',
            name: 'Login',
            component: (resolve) => require(['@/views/login'],resolve)
        },
        {
            path: '/Home',
            name: 'Home',
            meta: {
                requireAuth: true
            },
            component: () => import( '@/views/Home'),
            // component:Home,
            children:[
                {
                    path: '/index',
                    name: 'index',
                    meta: {
                        requireAuth: true
                    },
                    component: () => import( '@/views/index')
                },
                {
                    path: '/personal',
                    name: 'personal',
                    component: (resolve) => require(['@/views/personal'],resolve)
                },
                {
                    path: '/orderDetail',
                    name: 'orderDetail',
                    component: (resolve) => require(['@/views/orderDetail'],resolve)
                }
            ]
        }
    ]
})
router.$addRoutes = (params) => {
  router.matcher = new Router({mode:'history'}).matcher
  router.addRoutes(params)
}

export default router
