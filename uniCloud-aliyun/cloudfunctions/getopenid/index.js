'use strict';
const db = uniCloud.database();
const user = db.collection('user');

const APPID = 'wxcbadca8de1f6afde';
const SECRET = 'ed8cfaf73b9d3d60ea12548274f25b21';
async function getOpenId(event) {
	let res = await uniCloud.httpclient.request(
		"https://api.weixin.qq.com/sns/jscode2session?appid=" + APPID +
		"&secret=" + SECRET + "&js_code=" + event.code +
		"&grant_type=authorization_code", {
			method: 'GET',
			dataType: 'json'
		})
	return res.data 
	// 返回数据
	// {
	// 	"session_key": "8nrDpGdNO5PFzXeO0Ala5Q==",
	// 	"openid": "oMvMN5GehiL5kaRuuWR49l6WxEyA"
	// }
}


exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	let data = {}
	data = await getOpenId(event)

	let openid = await user.where({
		"openid": data.openid
		// "openid":"123456"
	}).get()
	// 用户初次登录
	if (openid.data.length === 0) {
		console.log("不存在")
		user.add({
			"openid": data.openid,
			"like": []
		})
	}

	data.like = openid.data[0].like


	//返回数据给客户端
	return data
	// {
	// 	"session_key": "bJLoyhZzCSiKW4TgfAd9QA==",
	// 	"openid": "oMvMN5GehiL5kaRuuWR49l6WxEyA",
	// 	"like":["520666","tingxiaojie"]

	// }
};
