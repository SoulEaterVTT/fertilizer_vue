import { constantRouterMap } from '@/router'
import { Layout } from '@/layout/home'
import Layout2 from '@/layout/home/secondContent'
const _import = require('@/router/get_component')

const state = {
  routers: constantRouterMap
}
const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.routers = constantRouterMap.concat(routers) // 总路由
  }
}
const actions = {
  generateRoutes({ commit }, roules) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRouter(roules)
      commit('SET_ROUTERS', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'Layout2') {
        route.component = Layout2
      } else {
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

export default {
  state,
  mutations,
  actions
}
