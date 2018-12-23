#!/usr/bin/env node


var fs = require('fs');
var express = require('express');
var routes = require('./routes');


var app = express();
var port = process.env.PORT || 433;

var server;
if (port == 443){

  let options = {
    key: fs.readFileSync( './localhost.key' ),
    cert: fs.readFileSync( './localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
  };

  

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
  }
  else {
  
  }


  let https = require('https');
  server = https.createServer( options, app );
  
  
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
  let http = require('http');
  
  server = http.createServer(app)

  app.use('/', routes);
}

// Turn on that server!
server.listen( port, () => {
  console.log(`App listening on port ${port}`);
}); 

module.exports = app