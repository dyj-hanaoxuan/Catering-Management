import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 数据
const state = {
  // 判断是否刷新
  isRefresh:true,
  // 判断是否登录
  isLogin:window.sessionStorage.getItem('isLogin') ? Boolean(window.sessionStorage.getItem('menuInfo')) : false,
  // 菜单数据
  menuInfo:(window.sessionStorage.getItem('menuInfo')) ? JSON.parse(window.sessionStorage.getItem('menuInfo')) : [],
  // 用户数据
  employeeInfo:(window.sessionStorage.getItem('employeeInfo')) ? JSON.parse(window.sessionStorage.getItem('employeeInfo')) : [],
  // token
  token:(window.sessionStorage.getItem('token')) ? JSON.parse(window.sessionStorage.getItem('token')) : undefined
}

// 数据获取
const getters = {
    getIsRefresh(state){
      return state.isRefresh
    },
    getIsLogin(state){
        return state.isLogin
    },
    getMenuInfo(state){
        return state.menuInfo
    },
    getemployeeInfo(state){
        return state.employeeInfo
    },
    getToken(state){
        return state.token
    }
}

// 行为，要执行的操作，如果有流程判断、异步请求也写在这里（主要是异步）
const actions = {
    setNoRefresh ({ commit }) {
        commit('setNoRefresh')
    },
    loginSuccess ({ commit }, data) {
        commit('LoginSuccess', data)
    },
    LoginExit ({ commit }) {
        commit('LoginExit')
    }
}

// 处理状态的改变
const mutations = {
  // 设置不刷新
  setNoRefresh(state){
    state.isRefresh = false
  },
  // 登录成功
  LoginSuccess(state,data){
    state.isLogin = true;
    state.menuInfo = data.data[0].menuInfo;
    state.employeeInfo = data.data[0].employeeInfo;
    state.token = data.token;
    window.sessionStorage.setItem('isLogin',true);
    window.sessionStorage.setItem('menuInfo',JSON.stringify(data.data[0].menuInfo));
    window.sessionStorage.setItem('token',JSON.stringify(data.token));
    window.sessionStorage.setItem('employeeInfo',JSON.stringify(data.data[0].employeeInfo));
  },
  // 退出登录
  LoginExit(){
      state.isLogin = false;
      state.menuInfo = [];
      state.employeeInfo = [];
      state.token = undefined;
      window.sessionStorage.setItem('isLogin',false);
      window.sessionStorage.removeItem('menuInfo');
      window.sessionStorage.removeItem('employeeInfo');
      window.sessionStorage.setItem('token',undefined);
  }
}
const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    modules: {
    }
})
export default store

