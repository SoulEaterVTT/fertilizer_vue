import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { setStore, removeStore } from "@/utils/mUtils";
const state = {
  token: getToken()
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  }
}

const actions = {
  // user login
  login({ commit }, res) {
    return new Promise(resolve => {
      console.log(res)
      commit('SET_TOKEN', res.data.token)
      setToken("Token", res.data.token);
      setToken("Access", res.data.access);
      setStore("platformId", res.data.platformId);
      setStore("appId", res.data.appId);
      resolve()
    })
  },

  // remove token
  resetToken({ commit, dispatch }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', null)
      removeToken("Token")
      removeToken("Access")
      removeStore("platformId")
      removeStore("appId")
      resetRouter()
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },


}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
