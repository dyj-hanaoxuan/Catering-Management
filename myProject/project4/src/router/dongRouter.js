/**
 * Created by Administrator on 2020/6/10.
 */
import router from './index'
import store from './../store'
function createRouterDiGui (arr) {
    const subRoutes = []
    arr.forEach((item) => {
        if (item.componentPath === '') {
            subRoutes.push({
                path: item.menuurl,
                name: item.pathname,
                meta: { requireAuth: true, menuId: item.menuId }
            })
        } else {
            subRoutes.push({
                path: item.menuurl,
                name: item.pathname,
                meta: { requireAuth: true, menuId: item.menuId },
                component: resolve => require(['@/views/' + item.componentpath + ''], resolve)
            })
        }
        // 判断是否有子数组
        if (item.menuChilds.length && item.menuChilds.length > 0) {
            subRoutes.push(...createRouterDiGui(item.menuChilds))
        }
    })
    return subRoutes
}

// 执行动态添加路由
function DynamicAddRouter () {
    let subRoutes = []
    subRoutes = createRouterDiGui(store.getters.getMenuInfo)
    router.options.routes[2].children.push(...subRoutes)
    console.log(router.options.routes[2].children)
    router.options.routes.push(
        {
            path: '*',
            name: '404',
            component: (resolve) => require(['@/views/Page404'], resolve)
        })
    console.log(router.options.routes)
    router.$addRoutes(router.options.routes)
}
export default {
    DynamicAddRouter: DynamicAddRouter
}


