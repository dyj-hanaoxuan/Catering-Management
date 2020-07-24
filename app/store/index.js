import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: uni.getStorageSync('userInfo')==undefined?{}:uni.getStorageInfoSync('userInfo'),
		num:0,
		tel:'',
		token: uni.getStorageSync("token")==undefined?{}:uni.getStorageInfoSync("token"),
	},
	actions: {
		set_login({commit},data){
			commit('set_login',data)
		},
		set_logout({commit}){
			commit('set_logout')
		},
		set_num({commit}, num){
			commit('set_num',num)
		},
		set_tel({commit}, tel){
			commit('set_tel',tel)
		},
		set_token({commit},token){
			commit('set_token',token)
		}
	},
	getters: {
		hasLogin: state => state.hasLogin,
		hasuser:state => state.userInfo,
		// hasuser:state => state.userInfo.token,
		hasNum: state => state.num,
		hasTel: state => state.tel,
		hasToken : state => state.token
	},
	mutations: {
		//改变状态
		set_login(state,data){
			
			state.hasLogin = true  
            state.userInfo.menuInfo = data.data[0].menuInfo;
            state.userInfo.employeeInfo = data.data[0].employeeInfo;
            // state.userInfo.token = data.token;
			state.token = data.token
			state.userInfo.e_id = data.data[0].employeeInfo.e_id
			state.userInfo.e_icon = data.data[0].employeeInfo.e_icon
			
			uni.setStorage({
				key:'userInfo',
				key:'token',
				data:state.userInfo,
				data:state.token,
				success(res) {
					console.log('缓存数据',data)
				  }
			})
		},
		//退出登录
		set_logout(state){
			state.hasLogin = false
			state.userInfo = {},
			state.token = undefined;
			uni.removeStorage({
				key:'userInfo',
				key:'token',
				success(err) {
					console.log('移除缓存')
					uni.reLaunch({
						url:'/pages/shopping/login/login.vue'
					})
				}
			})
		},
		set_num(state,num){
			state.num = num
			console.log("状态",state)
			console.log("111",num)
		},
		// set_token(state,token){
		// 	console.log('tpken',data.token)
		// 	state.token = token
		// 	console.log('token',token)
		// 	uni.setStorage({
		// 		key:"token",
		// 		data:state.token,	
		// 		success(data) {
		// 			console.log('token缓存数据',data)
		// 		  }
		// 	})
		// },
		set_tel(state,tel){
			// console.log("状态2",state)
			// console.log("222",tel)
			state.tel = tel
		}
	},
		
})
export default store