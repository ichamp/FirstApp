"use strict"

//var dbmaster = require('./db').dbmaster;
var dbslave = require('./db').dbslave;
//var dbmaster = require('/db').dbmaster;
var util = require('util');


var signin = {

	checklogin: function(req, cb) {
		var pwd = '123456';
		var user = 'siddharth';
    	var query1 = "select * from users";
    	//dbslave.query(query1);
    	var query = "select count(*) as count_person from users where password = '"+req.body.password+"' and username = '"+req.body.username+"' ";
    	console.log("Reached model/signin.js function");
    	dbslave.query(query, function(e, r) {
      		if (e) {
      			//console.log('FIRST   Error in dbquery');
        		return cb(e, r);
      		}

      		if (!r || !r.rows || !r.rows.length) {
      			//console.log('SECOND   DB response is ' + r +  'Idhar = ' + r.rows + 'length = ' + r.rows.length);
        		return cb(null, []);
      		}
	  	
	  		//console.log('THIRD DB response is ' + r +  'Idhar = ' + r.rows + 'length = ' + r.rows.length);
	  		console.log('Count of users is ' + r.rows[0].count_person );
	  		console.log(util.inspect(r, false, null));
      		return cb(null, r.rows[0].count_person);
    	});
  	},

  	beechkafunc : function(req, cb){
  		console.log("Logging from beechkafunc");
  	},

  	isvaliduser: function(req, cb) {
  		var query = "select count(*) as count_users from users where username = '" + req.body.username_forgot + "'";
  		console.log("Reached model isvaliduser function");
  		dbslave.query(query, function(e,r){
  			if(e)
  				return cb(e,r);

  			console.log('Count of users with the forgot password is ' + r.rows[0].count_users);
  			console.log(util.inspect(r,false,null));
  			return cb(null, r.rows[0].count_users);
  		});
  	},
  	
  	generate_reset_token: function(req, cb){
  		var query = "UPDATE users SET token = '" + req.body.token + "', token_time = '" + req.body.token_time + "' WHERE username = '" + req.body.username_forgot + "'";
  		console.log("In model generate reset token function");
  		console.log("Token = " + req.body.token + "   token_time = " + req.body.token_time);

  		dbslave.query(query, function(e,r){
  			if(e)
  			{
  				console.log("printing error");
  				console.log("error = " + e);
  				return cb(e,r);
  			}	
  			else
  			{
  				console.log("Printing results");
  				console.log(util.inspect(r, false, null));
  				return cb(null, req.body.token);
  			}
  		});
  	},

  	get_token_info : function(req, cb)
  	{
  		var ttoken;
  		if(!req.param('tok'))
  		{
  			console.log("In if part here.. hack");

  			ttoken =123;
  		}
  		else
  			ttoken = req.param('tok');

  		var query = "SELECT * from users where token = '"+ ttoken + "'";

  		dbslave.query(query, function(e,r){
  			console.log(util.inspect(r, false, null));
  			if(e)
  			{
  				return cb(e,r);
  			}
  			else if (!r || !r.rows || !r.rows.length) {
      			//console.log('SECOND   DB response is ' + r +  'Idhar = ' + r.rows + 'length = ' + r.rows.length);
      			var json = {'valid_token' : 0, 'username': uname, 'token': token, 'token_time' : token_time};
        		return cb(null, json);
      		}
  			else
  			{
  				var obj = r.rows[0];
  				var uname = obj.username;
  				var token = obj.token;
  				var token_time = obj.token_time;

  				/*
  				var jsonString = "{\"key\":\"value\"}";
				var jsonObj = JSON.parse(jsonString);
				console.log(jsonObj.key);
  				*/

  				var json = {'valid_token' : 1, 'username': uname, 'token': token, 'token_time' : token_time};

  				console.log('no error in function model/get_token_info');
  				cb(null, json);
  				//return cb(null, )
  			}
  		});
  		
  	},

  	isvaliduser_as_per_token: function(req, cb) {
  		var query = "select count(*) as count_users from users where username = '" + req.body.username + "' and token = '" + req.body.token + "'";
  		console.log("Reached model isvaliduser_as_per_token function");
  		dbslave.query(query, function(e,r){
  			if(e)
  				return cb(e,r);

  			console.log('Count of users with the forgot password is ' + r.rows[0].count_users);
  			console.log(util.inspect(r,false,null));
  			return cb(null, r.rows[0].count_users);
  		});
  	},

  	
  	updatepassword : function(req, cb){
  		var query = "UPDATE users SET password = '" + req.body.password + "' WHERE username = '" + req.body.username+ "'";
  		console.log("In model update password function");

  		dbslave.query(query, function(e,r){
  			if(e)
  			{
  				console.log("Some error while executing db query");
  				console.log("error = " + e);
  				return cb(e,r);
  			}	
  			else
  			{
  				console.log("DB entry updated");
  				console.log(util.inspect(r, false, null));
  				return cb(null, 1);
  			}
  		});
  	},

  	signup_submit_part : function(req, cb){
  		var query = "INSERT into users(username, password) values('"+req.body.username + "' , '" + req.body.password + "')";
  		console.log("In model signup function");

  		dbslave.query(query, function(e,r){
  			if(e)
  			{
  				console.log("Some error while executing db query");
  				console.log("error = " + e);
  				return cb(e,r);
  			}	
  			else
  			{
  				console.log("DB entry updated");
  				console.log(util.inspect(r, false, null));
  				return cb(null, 1);
  			}
  		});
  	},

  	checkuserexist: function(req, cb) {
    	//dbslave.query(query1);
    	var query = "select count(*) as count_person from users where username = '"+req.body.username+"' ";
    	console.log("Reached model/checkuserexist function");
    	dbslave.query(query, function(e, r) {
      		if (e) {
      			//console.log('FIRST   Error in dbquery');
        		return cb(e, r);
      		}

      		if (!r || !r.rows || !r.rows.length) {
      			//console.log('SECOND   DB response is ' + r +  'Idhar = ' + r.rows + 'length = ' + r.rows.length);
        		return cb(null, []);
      		}
	  	
	  		//console.log('THIRD DB response is ' + r +  'Idhar = ' + r.rows + 'length = ' + r.rows.length);
	  		console.log('Count of users is ' + r.rows[0].count_person );
	  		console.log(util.inspect(r, false, null));
      		return cb(null, r.rows[0].count_person);
    	});
  	},
/*
  dummyfunc : function(cb){
  	console.log("This is a dummy function from model/signin.js");
  	cb(e,res);
  	//res.send("IDHAR AA GAYA");
  },

  dummyfunc2 : function(req, res, next){
  	console.log('Dummy func 2 from model/singin.js');
  }

  //master: dbmaster.define(table),
  //slave: dbslave.define(table)
*/
};

module.exports = signin;

/*
createtable query
CREATE TABLE `lolzdb`.`users` ( `index` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(32) NOT NULL , `password` TEXT NOT NULL , `token` TEXT NULL , `token_time` INT(12) NULL , PRIMARY KEY (`index`), UNIQUE (`username`)) ENGINE = InnoDB;

CREATE TABLE `lolzdb`.`users` ( `index` INT NOT NULL AUTO_INCREMENT , `username` VARCHAR(32) NOT NULL , `password` TEXT NOT NULL , `token` TEXT NULL , `token_time` TEXT NULL , PRIMARY KEY (`index`), UNIQUE (`username`)) ENGINE = InnoDB;

INSERT into users(username, password) values("sid", "123");
*/