"use strict";

var util = require('util');
var anydbsql = require('anydb-sql');
var dbslave = require('../configs/dbslave');//.dbslave;
//var dbmaster = require('../configs/dbmaster');//.dbmaster;
function configure(config) {
  var dbConfig = { 
                  url: util.format('mysql://%s:%s@%s:3306/%s',
                                    encodeURIComponent(config.user),
                                    encodeURIComponent(config.password),
                                    config.host,
                                    config.database),
                  connections: { min: config.min, max: config.max }
                };

  var db = anydbsql(dbConfig);

  var str = util.format('mysql://%s:%s@%s:3306/%s',
                                    encodeURIComponent(config.user),
                                    encodeURIComponent(config.password),
                                    config.host,
                                    config.database);

  console.log("String is " + str);
  return db;
}


module.exports = { 
  //dbmaster: configure(dbmaster),
  dbslave: configure(dbslave)
};