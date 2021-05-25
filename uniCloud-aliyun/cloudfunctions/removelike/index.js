'use strict';
const db = uniCloud.database()
const user = db.collection('user')
// const $ = db.command.aggregate
const _ = db.command

async function remove(event){
	let res = await user.where({
		openid:event.openid
	}).update({
		like:_.pull(event.like)
	})
	return res.updated
}



exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let data = await remove(event)
	//返回数据给客户端
	return data
};
