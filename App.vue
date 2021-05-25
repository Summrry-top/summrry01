<script>
	import {
		mapMutations
	} from 'vuex'
	export default {
		methods: {
			...mapMutations(['login'])
		},
		onLaunch: function() {
			console.log('App Launch')
			let userInfo = uni.getStorageInfoSync('userInfo')
			console.log(1, userInfo)
			if (userInfo) {
				uni.getStorage({
					key: 'userInfo',
					success: (res) => {
						this.login(res.data)
						console.log('自动登录成功')

					}
				})
			}
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
</style>
