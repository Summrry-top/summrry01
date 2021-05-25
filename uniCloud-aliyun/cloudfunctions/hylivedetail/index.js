'use strict';
const cheerio = require('cheerio');
async function getlivedetail(event) {
	let res = await uniCloud.httpclient.request('https://m.huya.com/'+event.roomid, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Mobile Safari/537.36 '
		},
	})
	res = res.data.toString()
	let $ = cheerio.load(res)
	let data = {}
	data.url = []

	try {
		let livelineurl = res.match(/liveLineUrl = "([\s\S]*?)";/)[0]
		livelineurl = livelineurl.split('"')[1]
		livelineurl = new Buffer(livelineurl, 'base64').toString();
		// 头像
		data.profile = $('.pic-clip img').attr('src')
		// 标题
		data.title = $('.video_hd_title').text()
		// 昵称
		data.nick = $('div[class="live-info-desc"] h2:first').text()
		// 房间号
		data.roomid = $('.roomid').text().replace("房间号 : ","")
		// 分区
		data.channel = $('.live-info-txt .title').text()
		// 人气
		data.crowd = $('#videoHdCount').text()
		// 公告
		data.notice = $('.notice_content').text()
		// url

		if (livelineurl.indexOf('replay') != -1) {
			data.status = "重播中"
			data.url = [{
				"name": "①号线",
				"value": "https:" + livelineurl,
			}]
			return data
		}
		if (livelineurl === '') {
			data.statue = '主播暂时不在家'
			return data
		}
		data.status = "直播中"
		data.url = [{
				"name": "①号线",
				"value": "https:" + livelineurl
			},
			{
				"name": "②号线",
				"value": "https:" + livelineurl.replace('tx.hls.huya.com', 'bd.hls.huya.com')
			},
			{
				"name": "③号线",
				"value": "https:" + livelineurl.replace('tx.hls.huya.com', 'migu-bd.hls.huya.com')
			},
		]
		return data

	} catch (error) {
		data.status = "直播间不存在"
		return data
	}

}
exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	let data = await getlivedetail(event)



	//返回数据给客户端
	return data
};
