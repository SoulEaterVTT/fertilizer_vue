import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/layout/home/home'
Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/',
    component: Home,
    meta: {
      title: '系统管理',
      icon: 'setting',
    },
    children: [
      {
        path: '/User',
        component: () => import('@/views/UserManager'),
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'user',
          affix: true
        }
      },
      {
        path: '/Field',
        component: () => import('@/views/FieldManager'),
        name: 'Field',
        meta: {
          title: '地块管理',
          icon: 'user',
        }
      }
    ]
  }
]

export const asyncRouterMap = [
]

const createRouter = () => new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
