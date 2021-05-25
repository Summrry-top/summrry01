'use strict';
const db = uniCloud.database()
const user = db.collection('user')
// const $ = db.command.aggregate
const _ = db.command
async function add(event){
	// 数组尾部添加数组
	let res=await user.where({
		openid:event.openid
	}).update({
			like:_.push(event.like)
	})
	// 数组合并
	// let res=await user.aggregate().project({
	// 	like:$.concatArrays(['$like',event.like])
	// }).end()
	console.log(res)
	return res.updated
}

exports.main = async (event, context) => {
	//event为客户端上传的参数
	console.log('event : ', event)
	let data=await add(event)
	
	//返回数据给客户端
	return data
};
