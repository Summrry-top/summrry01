<template>

	<view class="wrap">
		<view class="u-tabs-box">
			<u-tabs-swiper ref="uTabs" :list="tabs" :current="current" @change="tabsChange" :is-scroll="false">
			</u-tabs-swiper>
		</view>
	
			<swiper :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item v-for="(item, index) in tabs" :key="index">
					<scroll-view scroll-y style="height: 100%;width: 100%;" @scrolltolower="onreachBottom">
						<heroItem :heroList="hlist"></heroItem>
					</scroll-view>

				</swiper-item>
			</swiper>

	</view>


</template>

<script>
	export default {
		data() {
			return {
				isStorage: 0,
				heroList: [],
				hlist: [],
				tabs: [{
					name: '全部'
				}, {
					name: '战士'
				}, {
					name: '法师',
				}, {
					name: '坦克'
				}, {
					name: "刺客"
				}, {
					name: "射手"
				}, {
					name: "辅助"
				}],
				// 因为内部的滑动机制限制，请将tabs组件和swiper组件的current用不同变量赋值
				current: 0, // tabs组件的current值，表示当前活动的tab选项
				swiperCurrent: 0, // swiper组件的current值，表示当前那个swiper-item是活动的

			}
		},
		onLoad() {
			this.getHeroList()
		},
		methods: {
			// 获取分类英雄列表数据
			getValidateData(type) {
				if (!type) {
					this.hlist = this.heroList
				} else {
					// this.hlist = []
					this.hlist = this.heroList.filter(function(item) {
						return item.hero_type == type || item.hero_type2 == type || item.pay_type == type
					})
				}
			},
			// 请求英雄列表数据
			async getHeroList() {
				// const data = await this.$http({
				// 	url: '/hero/hero',
				// })
				let [error,res]=await uni.request({
					// #ifdef MP
					url:'https://pvp.qq.com/web201605/js/herolist.json',
					// #endif
					// #ifdef H5
					url:'/web201605/js/herolist.json',
					// #endif
				})
				this.heroList = res.data
				this.heroList.reverse()
				this.getValidateData(0)
			},
			// tabs通知swiper切换
			tabsChange(index) {
				this.swiperCurrent = index;
				this.getValidateData(index)
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
				this.getValidateData(current)
				this.$refs.uTabs.setFinishCurrent(current);
				this.swiperCurrent = current;
				this.current = current;

			},
			// scroll-view到底部加载更多
			onreachBottom() {
				
			}

		}
	}
</script>

<style lang="scss">
	.wrap {
		height: 100vh;
		color: $text-color;

		swiper {
			height: calc(100vh - 44px); // 小程序
		}
	}
</style>
