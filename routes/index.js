"use strict";

var signin = require('./signin');

var session = require('express-session');
//module.exports = router;
/*
var middle123 = function(req, res, next)
{
	console.log("set session variable over here");
	session({secret: 'ssshhhhh'});
	next();
}
*/
module.exports = function(router){
	//router.all('/', session({secret: 'ssshhhhh'}));
	//router.use('/', middle123);
	
	//router.use('*',signin.prevention);
	//router.use('/', function(req, res, next){res.redirect('/login'); next();} );
	/*
	router.use(function(req, res, next){
		console.log('Time: %d', Date.now());
		next();
	});
	*/
	router.use('/', session({secret: 'ssshhhhh'}));
	router.all('/', signin.showpage);
	
	//router.use('/', session({secret: 'ssshhhhh'}));		//if we make it router.all then sessions will not work
	//router.get('/', signin1.showpage);
	router.all('/checkuser', signin.formcheck, signin.authenticate_user);
	router.all('/signout', signin.signout);
	router.all('/invaliduser', signin.invaliduser);

	router.all('/check', signin.check);

	router.all('/forgot_user', signin.forgot_user);
	router.all('/forgot_password_handle_token', signin.formcheck, signin.forgot_password_handle_token);

	router.all('/resetpassword/', signin.formcheck, signin.resetpassword);

	router.all('/updatepassword', signin.formcheck, signin.updatepassword);

	router.all('/cookie',function(req, res){
     	res.cookie('abcd' , 'cookie_value').send('Cookie is set');
	});

	router.all('/cookiecheck', function(req, res) {
  		console.log("Cookies :  ", req.cookies);
	});

	router.all('/signup', signin.signup);

	router.all('/signup_submit', signin.signup_submit);
}	