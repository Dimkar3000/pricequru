#!/usr/bin/env node

var https = require('https');
var fs = require('fs');
var express = require('express');
var session = require('express-session')

var options = {
    key: fs.readFileSync( './localhost.key' ),
    cert: fs.readFileSync( './localhost.cert' ),
    requestCert: false,
    rejectUnauthorized: false
};
var app = express();
var port = process.env.PORT || 443;
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


var server = https.createServer( options, app );

const routes = require('./routes');


app.use(function(req,res,next) {
  if (!/https/.test(req.protocol)){
     res.redirect("https://" + req.headers.host + req.url);
  } else {
     return next();
  } 
});

app.use('/', routes);
// Turn on that server!
server.listen( port, () => {
  console.log(`App listening on port ${port}`);
});

// Redirect from http port 80 to https
//var http = require('http');
//http.createServer(function (req, res) {
//    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//    res.end();
//}).listen(80);

module.exports = app