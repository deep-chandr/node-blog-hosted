var express = require('express');
var router = express.Router();
var moment = require('moment');
const db = require('monk')('localhost/nodeblog');

/* GET home page. */
router.get('/', function(req, res, next) {
		db.get('posts').find({}).then(function(posts){
		//console.log(posts);
		res.render('index', { title: 'Your_BLog', posts: posts});
	})
});

module.exports = router;
