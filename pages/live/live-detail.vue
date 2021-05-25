<template>
	<view class="wrap">

		<view class="container" v-if="data.status==='直播间不存在'" style="text-align: center;">
			<image src="https://a.msstatic.com/huya/main3/assets/img/page404/error_anchors_2c738.jpg" mode="widthFix">
			</image>
			<view style="">
				<text>哎呀，这里找不到这个主播，要不到虎牙去？</text>
			</view>

		</view>
		<view class="container" v-else>
			<!-- 播放器 -->
			<view class="">
				<video id='myVideo' :src="url" autoplay controls enable-play-gesture></video>
			</view>
			<!-- 骨架 -->
			<view class="con u-skeleton">
				<!-- 主播信息 -->
				<view class="userinfo">
					<image class="userinfo-avatar u-skeleton-circle" :src="data.profile"></image>
					<view class="user-detail-box">
						<view class="user-detail u-skeleton-fillet">
							<view>{{data.nick}}</view>

							<view v-if="data.crowd!=''">
								<u-icon name="account" color="#000" size="20"></u-icon>{{data.crowd}}
							</view>
							<view class="">
								<button v-show="hasLike" type="mini" @click="remove()">退订</button>
								<button v-show="!hasLike" type="mini" @click="add()">订阅</button>
							</view>
						</view>
						<view class="user-detail u-skeleton-fillet">
							<view v-if="data.title===''">
								主播不在线
							</view>
							<view v-else>{{data.title}}</view>
						</view>
					</view>
				</view>
				<!-- 主播公告 -->
				<view class="notice u-skeleton-fillet">
					<view class="tip">
						<view>主播公告：</view>
						<view>{{data.roomid}}</view>
					</view>
					<view class="" style="padding-left: 50rpx;">
						<rich-text :nodes="data.notice"></rich-text>
					</view>
				</view>
				<!-- 线路 -->
				<view class="line">
					<view class="">当前线路：</view>
					<view class="line u-skeleton-fillet">
						<u-radio-group v-model="value">
							<u-radio @change="radioChange(index)" v-for="(item, index) in data.url" :key="index"
								:name="item.name">
								{{item.name}}
							</u-radio>
						</u-radio-group>
					</view>
				</view>

				<view class="">
					<u-link href="'http://www.huya.com/'+this.room">复制本直播间链接，到浏览器打开</u-link>
				</view>
			</view>

			<!--引用组件-->
			<u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
		</view>
	
		
	</view>
</template>

<script>
	import {
		mapState,
		mapMutations
	} from 'vuex'
	export default {
		data() {
			return {
				like: [],
				current: 0,
				room: '0',
				hasLike: false,
				data: {},
				url: "",
				value: '①号线',
				loading: true, // 是否显示骨架屏组件
			};
		},
		onLoad(options) {
			if (options.profileRoom) {
				this.room = options.profileRoom
			}
			this.getUrl()
			this.getLike()

		},
		computed:mapState(['hasLogin', 'userInfo','live']),
		methods: {
			radioChange(index) {
				console.log(index)
				this.url = this.data.url[index].value,
					console.log(this.url)
				// this.videoContext.play()
			},
			getUrl() {
				uni.request({
					url: "https://hero.summrry.top/hy/liveurl/" + this.room,
					fail: () => {
						this.url = "https://m3u8.summrry.top/ad.mp4"
					},
					success: (res) => {
						console.log(this.room)
						this.data = res.data
						this.data.roomid=this.data.roomid.replace("房间号 : ",'')
						this.value = res.data.url[0]['name']
						this.loading = false
						this.url = res.data.url[0]['value']
						this.videoContext = uni.createVideoContext('myVideo', this)
						this.videoContext.play()
						this.videoContext.requestFullScreen()
					}
				})
			},
			getLike() {
				if (!this.hasLogin) {
					return
				}
				uniCloud.callFunction({
					name: "getlike",
					data: {
						openid: this.userInfo.openid
					},
					success: (res) => {
						this.like = res.result
						if(this.like.indexOf(this.room) != -1){
							this.hasLike=true
						}
						console.log('get',this.like,this.hasLike)
					}
				})
			},
			remove() {
				this.goLogin()
				if (this.hasLogin) {
					uniCloud.callFunction({
						name: "removelike",
						data: {
							openid: this.userInfo.openid,
							like: this.room
						},
						success: (res) => {
							this.like.splice(this.like.indexOf(this.room), 1)
							// res.result=1
							this.hasLike=false
							this.live.filter((item,index)=>{
								if(item.roomid===this.room){
									this.live.splice(index,1)
								}
							})
						}
					})
				} else {
					console.log("请你登录")
				}
			},
			add() {
				this.goLogin()
				if (this.hasLogin) {
					uniCloud.callFunction({
						name: "addlike",
						data: {
							openid: this.userInfo.openid,
							like: [this.room]
						},
						success: (res) => {
							// res.result=1
							this.like.push(this.room)
							this.live.push(this.data)
							this.hasLike=true
							console.log(res.result)
						}
					})
				} else {
					console.log("请登录")
				}
			},
			goLogin() {
				if (!this.hasLogin) {
					uni.getUserProfile({
						desc: '用于完善会员资料',
						lang: 'zh_CN',
						success: (res) => {
							this.getOpenid(res.userInfo)
						},
					})
				}
			},
			// 获取code 小程序专有，用户登录凭证。
			getOpenid(userInfo) {
				uni.login({
					provider: 'weixin',
					success: (res) => {
						uniCloud.callFunction({
							name: "getopenid",
							data: {
								code: res.code
							},
							success: (res) => {
								userInfo.openid = res.result.openid
								userInfo.like = res.result.like
								this.like = res.result.like
								if(this.like.indexOf(this.room) != -1){
									this.hasLike=true
								}
								this.$store.commit("login", userInfo)
							},
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.wrap {
		height: 100vh;
		// background-image:url('../../static/bg.jpg');
		// background-color: rgb(244, 245, 248);

		.container {
			width: 100%;
			display: flex;
			flex-flow: row wrap;
		}

		video {
			width: 750rpx;
		}

		.con {
			padding: 20rpx;
			display: flex;
			width: 100%;
			background-color: #fff;
			flex-direction: column;



			.userinfo {
				display: flex;
				flex-direction: row;
				margin-bottom: 20rpx;

				.userinfo-avatar {
					width: 128rpx;
					height: 128rpx;

					border-radius: 50%;
				}

				.user-detail-box {
					flex: 1;
					display: flex;
					flex-direction: column;

					.user-detail {
						margin: 10rpx;
						height: 44rpx;
						display: flex;
						justify-content: space-between;

					}
				}
			}

			.notice {
				margin-bottom: 20rpx;

				.tip {
					display: flex;
					justify-content: space-between;
					margin-bottom: 10rpx;
				}
			}



			.line {
				// display: flex;
				// justify-content: space-between;
				// 
				margin-bottom: 20rpx;
			}




		}


	}
</style>
