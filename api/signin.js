"use strict"

var signinmodel = require('../model/signin');
//var md5func = require('md5');

var md5func = require("blueimp-md5").md5;//require('md5').md5;

var signin = {

	login_check : function(req, cb){
		

		console.log('Printing log from api folder, file - signin');
		var error;
		signinmodel.checklogin(req, function(e,count){
			console.log('In callback of api/singin.js');
			
			if(e)
			{
				error = new error();
				error.code = 123;
				console.log('Error occured dude ' + error);
			}
			else
			{
				if(count == 0)
				{
					//The entry does not exist in database
					console.log("Callback with 0");
					cb(null, 0);

				}
				else
				{
					//Entry matches in database. Do whatever want to do next.
					console.log("Callback with 1");

					cb(null, 1);
				}
			}	
		});
		console.log("Last line of login check function");
	},

	ifvaliduser_generate_token : function(req, cb){
		var error;
		console.log("Isvaliduser from api folder");
		signinmodel.isvaliduser(req, function(e, count){
			console.log("In callback of isvaliduser");

			if(e)
			{
				error = new error();
				error.code = 100;	//error in fetching valid username.
				console.log("Error occured here" + error);
				cb(error, count);
				//cb(e,r);
			}
			else
			{
				if(count == 0)
				{
					console.log("Callback with 0 lolz. This means user does not exists");
					cb(null, 0);
				}
				else
				{
					console.log("Callback with 1 lolz");
					console.log("Checking if md5 function works");
					var curr_time = Date.now();
					var hashval = req.body.username_forgot + curr_time;
					hashval = md5func(hashval);

					console.log(hashval);

					//Adding additional values to req..
					req.body.token = hashval;
					req.body.token_time = curr_time;
					//console.log("Token_time entered into db = " + req.body.token_time);
					//Before callback, execute token generation in database
					signinmodel.generate_reset_token(req, function(e, doneval)
					{
						//Left out error over here.. too much callbacks already.
						console.log("Reached callback of generate reset token function");
						console.log("Doneval = " + doneval);
						if(e)
						{
							error = new error();
							error.code = "101";	//error in generating token
							cb(error, doneval);
						}	
						else
						{
							

							//directly processing with doneval value.
							if(doneval == 0)
								cb(null, 0); //SOME PANGA over here
							else
								cb(null, doneval); //TOKENS generated successfully
						}
					});
					//cb(null, hashval);
				}
			}
		});
		console.log("Last line of isvalid user function");
	},

	get_token_info : function(req, cb){
		var error;
		console.log("In get token info in api folder");
		//cb(null, 0);
		signinmodel.get_token_info(req, function(e, jsonobj){
			cb(e,jsonobj);
		});
		//signinmodel.get_token_info(req, function(e, count)
		
	},


	ifvaliduser_update_password : function(req, cb){
		var error;
		console.log("Isvaliduser from api folder");
		signinmodel.isvaliduser_as_per_token(req, function(e, count){
			console.log("In callback of isvaliduser");

			if(e)
			{
				error = new error();
				error.code = 100;	//error in fetching valid username.
				console.log("Error occured here" + error);
				cb(error, count);
				//cb(e,r);
			}
			else
			{
				if(count == 0)
				{
					console.log("Callback with 0 lolz. This means user does not exists with this username and token for forget pass");	
					cb(null, 0);
				}
				else
				{
					console.log("Updating username and password");
					//console.log("Token_time entered into db = " + req.body.token_time);
					//Before callback, execute token generation in database
					signinmodel.updatepassword(req, function(e, doneval)
					{
						//Left out error over here.. too much callbacks already.
						console.log("Reached callback of generate reset token function");
						console.log("Doneval = " + doneval);
						if(e)
						{
							error = new error();
							error.code = "101";	//error in generating token
							cb(error, doneval);
						}	
						else
						{
							//directly processing with doneval value.
							if(doneval == 0)
								cb(null, 0); //SOME PANGA over here
							else
								cb(null, doneval); //TOKENS generated successfully
						}
					});
					//cb(null, hashval);
				}
			}
		});
		console.log("Last line of ifvalid update password function");
	},

	signup_submit_part : function(req, cb){
		var error;
		console.log("In api signup function");
		//cb(null, 0);
		signinmodel.signup_submit_part(req, function(e, r){
			cb(e,r);
		});
		//signinmodel.get_token_info(req, function(e, count)
		
	},

	checkuserexist : function(req, cb){
		signinmodel.checkuserexist(req, function(e,r){
			cb(e, r);
		});
	}


};

module.exports = signin;