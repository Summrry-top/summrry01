// const BASE_URL = 'https://pvp.qq.com'
const BASE_URL = 'https://hero.summrry.top'


export const http = (options) => {

	return new Promise((resolve, reject) => {
		uni.request({
			url: BASE_URL + options.url,
			method: options.method || 'GET',
			data: options.data || {},
			success: (res) => {
				resolve(res.data)
			},
			fail: (err) => {
				uni.showToast({
					title: '请求接口失败'
				})
				reject(err)
			}
		})
	})
}

