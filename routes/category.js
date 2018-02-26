var Posts = require('../models/addpost');

var path = require('path');
var express = require('express');
var router = express.Router();
var validator = require('validator');


router.get('/add', function(req, res, next) {
	res.render('addcategory', {title: 'Add_Category'});
});

router.post('/add', function(req, res, next){
	console.log(req.body.newcategory);
	Posts.insert_category({title: req.body.newcategory},function(err, data){
		if(err) throw err;
		//console.log('-----------Category successfully inserted. ');
		res.redirect('/');
	})
});


router.get('/show/:title', function(req, res, next){
	//res.send(req.params.title);
	Posts.fetch_doc_by_category(req.params.title, function(err, docs){
		//console.log('---------------------data successfully fetched.');
		res.render('index', { title: req.params.title, posts: docs});
	})

})

module.exports = router;
