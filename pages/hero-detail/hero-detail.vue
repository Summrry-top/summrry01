<template>
	<view class="wrap">

		<u-navbar :is-back="true" :title="cname" :title-color="color" :back-icon-color="color" :background="backgroundImage" :border-bottom="false">
		</u-navbar>
		<view class="story">
			<scroll-view scroll-y style="height: 100%;width: 100%;" >
				<u-parse :html="story" :selectable="true" :show-with-animation="true"></u-parse>
				<view style="height: 40px;"></view>
			</scroll-view>
			
		</view>
		
		

	</view>
</template>

<script>
	export default {
		onLoad(options) {
			this.getData(options.ename)
		},
		data() {
			return {
				cname:'',
				story: "",
				color:'#ffff00',
				background: {
					// backgroundColor: '#001f3f',
					// 导航栏背景图
					// background: 'url(https://cdn.uviewui.com/uview/swiper/1.jpg) no-repeat',
					// 还可以设置背景图size属性
					// backgroundSize: 'cover',
					// 渐变色
					// backgroundImage: 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))',
					// backgroundImage: 'url(../../static/bg.jpg)',
					backgroundImage:'url(https://cdn.nlark.com/yuque/0/2020/jpeg/280373/1601880875613-assets/web-upload/d8be29d5-5d87-4432-ba17-4f2301cf529a.jpeg) no-repeat'
				}
			};
		},
		methods: {
			async getData(ename) {
				const data = await this.$http({
					url: '/herodetail/' + ename,
				})
				this.cname=data.cname
				this.story=data.story
			},
		}
	}
</script>

<style lang="scss">
	.wrap{
		height:100vh;
		background-image:url('https://cdn.nlark.com/yuque/0/2020/jpeg/280373/1601880875613-assets/web-upload/d8be29d5-5d87-4432-ba17-4f2301cf529a.jpeg');
		
		.story{
			height: calc(100vh - 80px);
		}
	}


</style>
