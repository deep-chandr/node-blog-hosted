var express = require('express');
var router = express.Router();
var moment = require('moment');
const db = require('monk')('mongodb://deep:deep123@ds215219.mlab.com:15219/node_blog');

/* GET home page. */
router.get('/', function(req, res, next) {
	// res.send('hello');
		db.get('posts').find({}).then(function(posts){
		//console.log(posts);
		res.render('index', { title: 'Your_BLog', posts: posts});
	})
});

module.exports = router;
