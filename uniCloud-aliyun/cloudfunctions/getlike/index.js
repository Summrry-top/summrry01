'use strict';
const db = uniCloud.database();
const user = db.collection('user');
async function getlike(event){
	let openid=await user.where({
		openid:event.openid
	}).get()
	return openid.data[0].like
	
}
exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let data = await getlike(event)
	//返回数据给客户端
	return data
};
