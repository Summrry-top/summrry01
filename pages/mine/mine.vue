<template>
	<view class="center">
		<view class="logo" @click="goLogin">
			<u-avatar :src="hasLogin ? userInfo.avatarUrl :avatarUrl" :show-sex="hasLogin?true:false" :sex-icon="gender"
				size="100"></u-avatar>
			<text class="username">{{hasLogin ? userInfo.nickName : '您未登录'}}</text>
		</view>
		<u-cell-group>
			<u-cell-item :title="mylike" :arrow="false">
				<view slot="label" class="like-wrap">
					<navigator v-for="(item,index) in live" :key="index"
						:url="'/pages/live/live-detail?profileRoom='+item.roomid" class="box">
						<view class="tag-living" v-if="item.url.length>0">
							<view class="icon-living"></view>
						</view>
						<u-avatar :src="item.profile" :size="90"></u-avatar>
						<text class="nick">{{item.nick}}</text>
						<text>{{item.roomid}}</text>
					</navigator>
				</view>
			</u-cell-item>
			<u-cell-item icon="setting-fill" title="退出登录" @click="logout()">
				<u-icon slot="icon" size="32" name="info-circle"></u-icon>
			</u-cell-item>
			<u-cell-item icon="setting-fill" title="关于" @click="show=true">
				<u-icon slot="icon" size="32" name="info-circle"></u-icon>
			</u-cell-item>
		</u-cell-group>
		<!-- 关于 -->
		<u-popup v-model="show" mode="center" border-radius="50" closeable="true">
			<view style="width: 400rpx;height: 400rpx;text-align: center;margin-top: 20rpx;" >
				<text>--关于--</text>
			</view>
		</u-popup>
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
				avatarUrl: "../../static/logo.png",
				show:false
			}
		},
		computed: {
			...mapState(['hasLogin', 'userInfo', 'live']),
			list: function() {
				if (!this.hasLogin) {
					console.log('未登录')
					return 0
				}
				this.$store.commit("getlive")
				return 5
			},
			mylike: function() {
				console.log(this.live)
				return '我的订阅(' + this.live.length + ')'
			},
			gender: function() {
				if (this.userInfo.gender === 1) {
					return 'man'
				}
				if (this.userInfo.gender === 2) {
					return 'woman'
				}
			},
		},
		methods: {
			about() {

			},
			logout(index) {
				console.log(index)
				this.$store.commit("logout")
				console.log('退出', this.userInfo, this.hasLogin)

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
						console.log(123, res)
						uniCloud.callFunction({
							name: "getopenid",
							data: {
								code: res.code
							},
							success: (res) => {
								userInfo.openid = res.result.openid
								userInfo.like = res.result.like
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
	.center {
		.logo {
			display: flex;
			text-align: center;
			height: 160rpx;
			line-height: 160rpx;

			u-avatar {
				margin: 30rpx 50rpx;
			}
		}

		.like-wrap {
			display: flex;
			flex-flow: row wrap;

			.box {
				position: relative;
				width: 120rpx;
				height: auto;
				display: flex;
				flex-direction: column;
				text-align: center;
				margin-right: 10rpx;

				.tag-living {
					background-color: #ff7800;
					position: absolute;
					top: 70rpx;
					right: 0;
					z-index: 1;
					border-radius: 50%;

					.icon-living {
						padding: 0 9px;
						width: atuo;
						height: 18px;
						line-height: 18px;
						background-image: url(https://a.msstatic.com/huya/main3/widget/game-subscribe-item/img/icon_live_eb974.png);
						animation: matchLiving .6s steps(6) infinite;
						color: #007AFF;
					}
				}

				.nick {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					width: 100%;
				}
			}
		}





	}

	@keyframes matchLiving {
		0% {
			background-position: 0 0
		}

		to {
			background-position: -108px 0
		}
	}
</style>
