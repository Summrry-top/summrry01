<template>
	<view class="wrap">

		<view>
			<u-tabs-swiper ref="uTabs" :list="tabs" :current="current" @change="tabsChange" :is-scroll="false"
				swiperWidth="750"></u-tabs-swiper>
		</view>
		<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
			<swiper-item v-for="(item, index) in tabs" :key="index">
				<gameLiveItem :tagId="item.tagId" :tabIndex="index" :currentIndex="swiperCurrent"></gameLiveItem>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				errorImg: "http://a.msstatic.com/huya/main/assets/img/default/338x190.jpg",
				tabs: [{
						name: '全部',
						tagId: '0'
					}, {
						name: '艾琳',
						tagId: '4489'
					},
					{
						name: '大神',
						tagId: '323'
					}, {
						name: '美女',
						tagId: '37'
					},
					{
						name: '赛事&视频',
						tagId: '4319'
					}, {
						name: '模拟战',
						tagId: '2541'
					},
					{
						name: '带粉',
						tagId: '2127'
					},
				],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的
				// LiveList: [],
			};
		},
		methods: {
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
			},
			// swiper-item左右移动，通知tabs的滑块跟随移动
			transition(e) {
				let dx = e.detail.dx;
				this.$refs.uTabs.setDx(dx);
			},
			// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
			// swiper滑动结束，分别设置tabs和swiper的状态
			animationfinish(e) {
				let current = e.detail.current;
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;
			},

			// async getLiveList(type) {
			// 	let data=await uni.request({
			// 		url: 'https://hero.summrry.top/hy/livelist/' + type
			// 	})
			// 	return data
			// },


		}
	}
</script>

<style lang="scss">
	.wrap {
		height: 100vh;
		background-color: #F1F1F1;

		swiper {

			height: calc(100vh - 44px);
			swiper-item{
				height: 100%;
			}

		}
	}
</style>
