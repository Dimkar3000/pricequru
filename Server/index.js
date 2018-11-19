#!/usr/bin/env node

var fs = require('fs');
var express = require('express');
var session = require('express-session')
const routes = require('./routes');


var app = express();
var port = process.env.PORT || 433;

if (port == 443){

  var options = {
    key: fs.readFileSync( './localhost.key' ),
    cert: fs.readFileSync( './localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
  };

  var sess = {
    secret: 'keyboard cat',
    cookie: {},
    resave:false,
    saveUninitialized:true
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }
  else {
  
  }

  app.use(session(sess))

  var https = require('https');
  var server = https.createServer( options, app );
  
  
  app.use(function(req,res,next) {
    if (!/https/.test(req.protocol)){
       res.redirect("https://" + req.headers.host + req.url);
    } else {
       return next();
    } 
  });
  
  app.use('/', routes);

  
}
else{
  var http = require('http');
  var server = http.createServer(app)

  app.use('/', routes);
}

// Turn on that server!
server.listen( port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app