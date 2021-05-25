'use strict';
async function getLiveList(event) {
	let res;
	if (event.type === '0') {
		res = await uniCloud.httpclient.request(
			'https://www.huya.com/cache.php?m=LiveList&do=getLiveListByPage&tagAll=0&gameId=2336&page=' + event
			.page, {
				method: 'GET',
				dataType: 'json'

			})
	} else {
		res = await uniCloud.httpclient.request(
			'https://live.cdn.huya.com/livelist/game/tagLivelist?gameId=2336&tmpId=' + event.type + '&page=' +
			event.page,{
				method:'GET',
				dataType:'json'
			})
	}
	return res
}


exports.main = async (event, context) => {
	//event为客户端上传的参数
	// console.log('event : ', event)
	let res = await getLiveList(event)
	//返回数据给客户端
	return res.data
};
