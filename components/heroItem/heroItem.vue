<template>
	<view class="container">
		<view v-for="(item,index) in heroList" :key="index">
			<navigator :url="'/pages/hero-detail/hero-detail?ename='+item.ename" class="item">
				<image lazy-load="true" :src=getImgUrl(item.ename) mode="aspectFit"></image>
				<view>{{item.cname}}</view>
			</navigator>

		</view>
	</view>
</template>

<script>
	export default {
		name: "heroItem",
		data() {
			return {

			};
		},
		props: ['heroList'],
		methods: {
			getImgUrl(ename) {
				return "//game.gtimg.cn/images/yxzj/img201606/heroimg/" + ename + "/" + ename + ".jpg"
			}
		}
	}
</script>

<style lang="scss">
	.container {
		display: flex;
		flex-flow: row wrap;

		.item {
			width: 25vw;
			height: auto;
			text-align: center;

			image {
				width: 150rpx;
				height: 150rpx;
			}
		}
	}
</style>
