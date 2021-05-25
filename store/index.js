import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {
			avatarUrl: '',
			nickname: '',
			city: '',
			country: '',
			gender: '',
			openid: '',
			province: '',
			like: []
		},
		live:[]
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider
			uni.setStorage({
				key: 'userInfo',
				data: provider
			})
			console.log(state.userInfo)
		},
		logout(state) {
			console.log(123)
			console.log('state',state)
			state.hasLogin = false;
			state.userInfo = {}
			state.live=[]
			console.log(state.userInfo,123)
			uni.removeStorage({
				key: 'userInfo'
			})
		},
		async getlive(state){
			let list = await uniCloud.callFunction({
				name:"getlike",
				data:{
					openid:state.userInfo.openid
				}
			})
			console.log(list)
			for (const i of list.result) {
				let res = await uniCloud.callFunction({
					name: "hylivedetail",
					data: {
						roomid: i
					},
				})
				state.live.push(res.result)
			}
		},
	}

})

export default store
