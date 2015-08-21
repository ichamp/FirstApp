"use strict"

var path = require('path');


//var session = require('express-session');
//var express = require('express');
//var app = express();	//Modified here
var api = require('../api/signin');
var html_dir = './public/html/';


var signin = {

	showpage : function(req, res, next){
		console.log('Middleware signin showpage.');
		res.sendfile(path.resolve(html_dir + 'signin.html'));		
		//next();
	},


	authenticate_user: function(req, res, next){

		var err;
		console.log("ENTRY routes/signin   authenticate_user function");
		//app.use('/',session({secret: 'ssshhhhh'}));
		api.login_check(req, function(e,r){
			if(e)
			{
				console.log("Some error in api called from authenticate_user");
				err = e || new Error('some error in authenticate user');
				err.status = 405;
			}
			else
			{
				//welcome_user_text
				if(r == 1)
				{
					console.log("MATCHES IF");
					//var session = require('express-session');
					//var sess = req.session;
					//app.use(session({secret: 'ssshhhhh'}));
					if(req.session)
						console.log("Session object exists");
					else
						console.log("Session object does not exist");

					req.session.username = req.body.username;
					//sess.logintime = time();
					var welcome_user_text = 'Hello valid user ' + req.body.username + ' !' ;
					res.render('welcome_user',{ title: 'WELCOME USER', tag1: welcome_user_text});
				}
				else
				{
					console.log("MATCHES ELSE");
					var welcome_user_text = "Hey no entry found with this username and password";
					res.render('invalid_user',{ title: 'INVALID USER', tag1: welcome_user_text});
					//res.render('welcome_user',{ title: 'INVALID USER', tag1: welcome_user_text});
				}
			}
			
			console.log('Response is' + r);

		});
		console.log('Last line of routes/signin.js');
		//next();
	},

	invaliduser: function(req, res, next){
		console.log('Middleware signin invaliduser');

		var user = req.body.username;
		console.log('Username posted here was' + user);

		//var username = req.('username');
		//console.log('Username does not exist' + username);
		res.render('signin', { title: 'INVALID USER', tag1: 'Hello there!'});

		//next();

	},

	signout: function(req, res, next){
		console.log("Signout function ");
		req.session.destroy();
		//var html = '<html><body>You have been logged out </body></html>' ;
		//res.send(html);
		setTimeout(function(){res.redirect('/')}, 1000);
		//showpage();	//Wont work.. okay
	},

	check: function(req, res, next){
		var message;
		if(req.session)
		{
			message = "Session exists username is " + req.session.username ;
			res.send(message);
		}	
		else
		{
			message = "NO SESSION EXISTS";
			res.send(message);
		}
	},

	prevention: function(req, res, next){
		console.log("Prevention middleware is being called");
		if(req.session)
			;
		else
		{
			//Redirecting to login page always
			//res.redirect("/login");
		}
		
	},
/*
	bookingpage: function(req, res, next){
		var message;
		if(req.session)
			message = "You are not valid user and cannot access inside. Go to
		*/

	forgot_user: function(req, res, next){
		console.log("In forgot password option");
		res.sendfile(path.resolve(html_dir + 'forgot_password.html'));
	},

	forgot_password_handle_token: function(req, res, next){
		console.log("In forgot password handle");

		//Initially check first if the username is valid or not.
		api.ifvaliduser_generate_token(req, function(e,r){
			if(e)
			{
				console.log("Some error logged here ");
				console.log("MATCHES ERROR");
				if(e.code == 100)
					console.log('Error in running query for finding if is valid user');
				if(e.code == 101)
					console.log('Error in running query to give password reset token');
			}
			else
			{
				if(r == 0)		//USERNAME NOT FOUND
				{
					//Username does not exist. Do not issue token. Also possible if some other error while executing query. 
					console.log("MATCHES IF");
					var uname = req.body.username_forgot;
					if(uname == '')
						uname = "Blank entry";
		
					var linkvar = '/signup';
					var linkvar_msg = 'Click here to goto signup page';
					var user_message = "Dear " + uname + "your entry does not exist in the database. Click here to signup";
					console.log('user_message is ' + user_message);
					res.render('forgot_password_handle_token', { title: 'FORGOT PASSWORD HANDLER', msg1: 'password recovery!', usermsg: user_message, linker: linkvar, linkvarmsg : linkvar_msg});

				}
			
				else
				{

					//Add code here to do DB handling and getting token entry into db

					//res.render()//Username EXISTS. Issue a password reset link to this guy.

					//The value r is returning the hash value generated in api file.

					console.log("MATCHES ELSE");
					var uname = req.body.username_forgot;
					if(uname == '')
						uname = "Blank entry";
					
					//var dummy_token = uname + Date.now();
					//console.log("Dummy token" + dummy_token);

					var linkvar = '/resetpassword';
					linkvar = linkvar + '?tok=' + r;

					console.log("Link generated for user is  " + linkvar );

					var linkvar_msg = 'Click here to reset your password';
					var user_message = "Dear " + uname + " please use the below link to reset your password";
					res.render('forgot_password_handle_token', { title: 'FORGOT PASSWORD HANDLER', msg1: 'password recovery!', usermsg: user_message, linker: linkvar, linkvarmsg : linkvar_msg});
				}
			}
		});

	},
	
	resetpassword: function(req, res, next){

		//if(!req.body)
		//	res.send("Please do not refresh and come to this page. will add check here");
		console.log("HERE routes/resetpassword");
		//res.render()
		var uname = req.body.username_forgot;
		if(uname == '')
			uname = "Blank entry";
		
		//	req.body.token_to_verify = req.

		api.get_token_info(req, function(e,jsonobj){

				console.log("DEBUGGING jsonobj");
				console.log(jsonobj);
				if(e)
				{
					console.log("SOME ERROR RECORDED");
					res.send("SOME ERROR HAPPENED");
				}
				else
				{	
					//console.log("Valid token val = ", jsonobj.valid_token);
					if(jsonobj.valid_token == 1)
					{
						//Token was valid. Now check if token was expired or not
						console.log("TOKEN EXISTS. CHECKING FOR VALID TIMESTAMP NOW");
						var token_time = parseInt(jsonobj.token_time);
						var token = jsonobj.token;
						var curr_time = parseInt(Date.now());

						console.log('Current time  = ' + curr_time);
						console.log('Token time    = ' + token_time);
						console.log('Time diff     = ' + (curr_time - token_time) );
						console.log('Logs printing done');

						var total_expiry_time = 1000*60*60;
						var time_expired = curr_time - token_time;
						var time_remaining = total_expiry_time - time_expired;

						if( time_expired < total_expiry_time)	//token valid for 1 hour
						{
							console.log("TOKEN TIMESTAMP VALID");

							//Initially set a cookie
							//res.cookie('cookiename', 'cookievalue', { maxAge: 900000, httpOnly: true });
							
							//res.cookie('timecookie', 1, expires: new Date(Date.now() + 900000) );
							
							
							res.cookie('timecookie', 1,  { maxAge: time_remaining, httpOnly: true });
							res.cookie('token', token,  { maxAge: time_remaining, httpOnly: true });

							//res.cookie('timecookie', 1,  { maxAge: 900000, httpOnly: true });
							//res.cookie('timecookie', 1);
							//res.cookie(cookie_name , 'cookie_value')
							console.log("COOKIE SET FOR USER HERE COOKIE");
							//res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })

							res.sendfile(path.resolve(html_dir + 'reset_password.html'));
							//render page now.. for resetting password
							//res.render('reset_password_view', { title: 'RESET PASSWORD PAGE', msg1: 'password recovery!', usermsg: user_message, linker: linkvar});
						}
						else
						{
							res.send("YOUR TOKEN EXPIRED, GO TO RESET PASSWORD PAGE AGAIN");

						}
					}
					else   //panga ho gaya.nesting broken
					{
							res.send("INVALID TOKEN. ENTRY NOT FOUND IN DB");
					}
				}
		});
		
	},

	updatepassword : function(req, res, next){
		console.log("In routes/updatepassword");
		/*
		console.log("cookie values");
		console.log(req.cookies);
		console.log(req.cookies.timecookie);
		console.log("Done");
		*/
		if(req.cookies.timecookie)
		{
			//res.send("Cookie exists");
			console.log("Cookie exists");

			req.body.token = req.cookies.token;
			api.ifvaliduser_update_password(req, function(e, is_done){
				if(e)
				{
					console.log("Some error while updating username and password in datanbase");
				}
				else
				{
					if(is_done == 0)
						res.send("The password reset token was not authorized for this id");
					if(is_done == 1)
					{
						//res.cookie('timecookie', 1,  { maxAge: time_remaining, httpOnly: true });
						//res.cookie('token', token,  { maxAge: time_remaining, httpOnly: true });

						res.clearCookie('timecookie');
						res.clearCookie('token');

						res.send("Updated username and password");
					}
				}
			});
		}
		else
		{
			res.send("Cookie expired. You can go to signin page to go to forget password option again.");
		}
		/*
		
		*/
	},

	signup : function(req, res, next){
		console.log("Signup page");
		res.sendfile(path.resolve(html_dir + 'signup.html'));
	},

	signup_submit: function(req, res, next){
		console.log("Signup submit");
		api.checkuserexist(req, function(e,user_exists_bool){
			if(e)
			{
				console.log("Some error in api called from authenticate_user");
				err = e || new Error('some error in authenticate user');
				err.status = 405;
			}
			else
			{
				//welcome_user_text
				if(user_exists_bool == 1)
				{
					res.send("Cannot signup. Username already exits");
				}
				else
				{
					console.log("Username not exists. Proceed with signup");
					api.signup_submit_part(req, function(e,r){
						if(e)
						{
							res.send("Some error with db query");
						}
						else
						{
							if(r == 1)
								res.send("Sign up complete. proceed to login page");

							else
								res.send("Some problem with signup for you");

						}
					});
				}
			}
			
			console.log('Response is' + user_exists_bool);

		});

	}

};


module.exports = signin;
