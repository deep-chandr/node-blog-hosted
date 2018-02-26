var Posts = require('../models/addpost');

var path = require('path');
var express = require('express');
var router = express.Router();
var validator = require('validator');
const crypto = require('crypto');
var multer  = require('multer');
//var upload = multer({ dest: path.join(__dirname, '../public/images/uploads') });
const storage = multer.diskStorage({
		  destination: path.join(__dirname, '../public/images/uploads'),
		  filename: function (req, file, callback) {
		    crypto.pseudoRandomBytes(16, function(err, raw) {
			  if (err) return callback(err);
			  callback(null, raw.toString('hex') + path.extname(file.originalname));
			});
		  }
});
var upload = multer({ storage: storage })




router.get('/add', function(req, res, next) {
	var errors = [];

	Posts.fetch_category(function(err, data){
		if (err) throw err;
		//console.log("The length of the docs is======"+data.length);
		//console.log('focus here       '+data);
		res.render('addpost',{	title: "Add_Post", 
								errors: errors,
								category_data: data,
								posttitle: '',
								author: '',
								postbody: ''
							});
	});
});


router.post('/add', upload.single('blogimage'), function(req, res, next){
	
	var posttitle = req.body.posttitle;
	var category= req.body.category;
	var author = req.body.author;
	var postbody= req.body.postbody;
	var date = new Date();

	var errors = [];

	if(validator.isEmpty(posttitle) ) errors = errors.concat(['---Title cannot be empty.']);
	if(validator.isEmpty(category) ) errors = errors.concat(['---Category cannot be empty.']);
	if(validator.isEmpty(author) ) errors = errors.concat(['---Author cannot be empty.']);
	if(validator.isEmpty(postbody) ) errors = errors.concat(['---Post body cannot be empty.']);

	if (!req.file) {
		    console.log("No file received");
		    errors = errors.concat(['---Image field is empty.']);
		    //var newImageName = 'noimage.jpg';
		    //return res.send({success: false});
	} else {
		    console.log('file received');
		    //var newImageName = req.file.filename;
		    //return res.send({success: true});
	}

	const host = req.host;
	const filePath = req.protocol + "://" + host + '/' + req.file.path;
	
	//console.log('The file path is:-----------'+filePath);
	//console.log(path.posix.basename(filePath));

	//console.log(errors.length);
	if (errors.length) {
	    //console.log('THere are errors'+ errors);
	    /*for (var i = 0; i < errors.length; i++) {
		    console.log(errors[i]);
		}*/
		Posts.fetch_category(function(err, data){
			if (err) throw err;
			//console.log("The length of the docs is======"+data.length);
			//console.log('focus here       '+data);
			res.render('addpost',{	title: "Add_Post", 
									errors: errors,
									category_data: data,
									posttitle: posttitle,
									author: author,
									postbody: postbody
								});
		});
		
	} else {
	    var data = {
	    	title: posttitle,
	    	category: category,
	    	author: author,
	    	body: postbody,
	    	img_address: path.posix.basename(filePath),
	    	date: new Date()
	    }
		Posts.insert_doc(data, function(err, data){
			if (err) throw err;
			//console.log(data);
			res.redirect('/');
		})
	}
})

router.get('/show/:post_id', function(req,res,next){
	console.log( '--------this is your id', req.params.post_id);

	Posts.show_current_post(req.params.post_id ,function(err, docs){
		if(err) throw err;
		console.log('----------Posts successfully fetched.');
		res.render('index_full', { title: 'Your_BLog', posts: docs});
	})
})

router.post('/addcomment', function(req, res, next){
	
	var comment_name = req.body.name;
	var comment_email = req.body.email;
	var comment_body = req.body.postbody;
	var post_id = req.body.post_id;
	var comment_date = new Date();

	var errors = [];
	if(!validator.isEmail(comment_email) ) errors = errors.concat(['Enter valid email address.']);
	if (errors.length) {

	    Posts.show_current_post(req.params.post_id ,function(err, docs){
			if(err) throw err;
			console.log('----------Posts successfully fetched.');
			res.render('index_full', { title: 'Your_BLog', posts: docs , errors: errors});
		})
		
	}else{
		var new_comment = {"name" : comment_name,"email": comment_email,"body" : comment_body,"date": comment_date}
	    Posts.insert_comments( post_id, new_comment, function(err, docs){
	    	if(err) throw err;
	    	console.log('documents updated.');
	    })
	    res.location('/posts/show/'+ post_id);
	    res.redirect('/posts/show/'+ post_id);
	}
})


module.exports = router;
