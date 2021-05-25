<template>
	<view class="wrap">
		<z-paging ref="paging" defaultPageSize="120" @query="queryList" :list.sync="dataList"
			:mounted-auto-call-reload="false" :refresher-angle-enable-change-continued="false"
			:touchmove-propagation-enabled="true" style="height: 100%;">

			<!-- <view slot="empty">无数据</view> -->
			<view class="container">
				<view v-for="(item,index) in dataList" :key="index" class="item">
					<navigator :url="'/pages/live/live-detail?profileRoom='+item.profileRoom" class="box">
						<image lazy-load="true" :src=getImgUrl(item.screenshot) mode="aspectFit"></image>
						<view class="roomName">{{item.roomName}}</view>
						<view class="nick">{{item.nick}}</view>
						<view class="totalCount">
							<u-icon name="account" color="#fff" size="15"></u-icon>
							{{format(item.totalCount)}}
						</view>
					</navigator>
				</view>

			</view>
		</z-paging>
	</view>
</template>

<script>
	export default {
		name: "gameLiveItem",
		data() {
			return {
				errorImg: "http://a.msstatic.com/huya/main/assets/img/default/338x190.jpg",
				dataList: [],
				firstLoaded: false
			};
		},
		props: {
			tabIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
			currentIndex: {
				type: Number,
				default: function() {
					return 0
				}
			},
			tagId: {}
		},
		watch: {
			currentIndex: {
				handler(newVal) {
					if (newVal === this.tabIndex) {
						//懒加载，当滑动到当前的item时，才去加载
						if (!this.firstLoaded) {
							this.$nextTick(() => {
								this.$refs.paging.reload();
							})
						}
					}
				},
				immediate: true
			},
		},

		methods: {
			queryList(pageNo, pageSize) {
				//组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
				//这里的pageNo和pageSize会自动计算好，直接传给服务器即可
				//模拟请求服务器获取分页数据，请替换成自己的网络请求
				// this.$request.queryList(pageNo, pageSize, this.tabIndex + 1, (data) => {
				// console.log(Object.prototype.toString.call(data))
				// console.log(data)
				// const data=[1,2,3,4,5,6,7,8,9,10]
				// this.$refs.paging.complete(data);
				// this.firstLoaded = true;
				// })
				// this.$http({
				// 	url:'/hy/livelist/'+this.tagId+'?page='+pageNo
				// }).then((res)=>{
				// 	this.$refs.paging.complete(res.data.datas);
				// 	this.firstLoaded = true;
				// })
				uniCloud.callFunction({
					name: "hylivelist",
					data: {
						type: this.tagId
					}
				}).then((res) => {
					console.log(res)
					this.$refs.paging.complete(res.result.data.datas);
					this.firstLoaded = true;
				})
				// let data = await this.$http({
				// 	url: '/hy/livelist/' + this.tagId + '?page=' + pageNo
				// })
				// this.$refs.paging.complete(data.data.datas);
				// this.firstLoaded = true;
				console.log('发起请求', this.tabIndex, this.tagId, pageNo, pageSize)
			},
			itemClick(item) {
				console.log('点击了', item.title);
			},
			getImgUrl(url) {
				return url +
					"?x-oss-process=image/resize,limit_0,m_fill,w_338,h_190/sharpen,80/format,jpg/interlace,1/quality,q_90"
			},
			format(num) {
				if (num < 10000) {
					return num
				}
				return this.roundFun(num / 10000, 1) + "万"
			},
			roundFun(value, n) {
				return Math.round(value * Math.pow(10, n)) / Math.pow(10, n);
			},
		}
	}
</script>

<style lang="scss">
	// page,
	z-paging{
		height: calc(100vh - 100px);
	}
	.wrap {
		height: 100%;
		/* 父节点建议开启flex布局 */
		// 不开启底部数据可能无法完全显示
		display: flex;
		flex-direction: column;
	}

	.container {
		display: flex;
		flex-flow: row wrap;

		.item {
			width: 375rpx;
			height: atuo;

			.box {
				width: 338rpx;
				margin: 9.25rpx 18.5rpx;
				height: calc(190rpx + 38px);
				position: relative;
				background-color: #fff;
				border-radius: 6px;
				font-size: 12px;
				box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.15);

				.roomName {
					color: #000;
				}

				.nick {
					position: absolute;
					top: 150rpx;
					left: 10rpx;
					color: #fff;
				}

				.totalCount {
					position: absolute;
					top: 150rpx;
					right: 10rpx;
					color: #fff;
				}


				image {
					width: 338rpx;
					height: 190rpx;
					border-radius: 6px 6px 0 0;

				}
			}
		}
	}
</style>
