const db = uniCloud.database();

exports.main = async (event, context) => {
	let {skip=0} = event;
	
	// 限制每页8条 和排序
	return await db.collection("article").limit(8).skip(skip).orderBy("posttime","desc").get()
};
