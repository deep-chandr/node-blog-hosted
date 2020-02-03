
const db = require('monk')('mongodb://deep:deep123@ds215219.mlab.com:15219/node_blog');

db.then(() => {
  console.log('Connected correctly to server')
});

const posts = db.get('posts');

module.exports.insert_doc = function(data, callback){
		//console.log(data);
	    posts.insert(data).then(function(){
	    	//console.log('------------data successfully inserted.');
			callback(null, data);
			db.close();
	    });
}
module.exports.fetch_doc_by_category = function(category, callback){
	posts.find({category: category}).then(function (docs) {
		//console.log("The length of the docs is======"+docs.length);
		callback(null , docs);
	})
}
module.exports.show_current_post = function(post_id, callback){
	posts.findOne({_id: post_id}).then(function (docs) {
		callback(null , docs);
	})
}
module.exports.insert_comments = function(post_id, new_comment, callback){
	posts.update({
		"_id": post_id
	},
	{
		$push:{"comments": new_comment}
	},
	function(err, doc, next){
		callback(null , doc);
	})
}






const category = db.get('category');
module.exports.insert_category = function(data, callback){
		//console.log(data);
	    category.insert(data).then(function(){
	    	//console.log('------------category successfully inserted.');
			callback(null, data);
			db.close();
	    });
}
module.exports.fetch_category = function(callback){
	category.find({}).then(function (docs) {
		//console.log("The length of the docs is======"+docs.length);
		callback(null , docs);
	})
}
/*
users.index('name last')
users.insert({ name: 'Tobi', bigdata: {} })
users.find({ name: 'Loki' }, '-bigdata').then(function () {
  // exclude bigdata field
})
users.find({}, {sort: {name: 1}}).then(function () {
  // sorted by name field
})
users.remove({ name: 'Loki' })
*/
