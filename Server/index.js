#!/usr/bin/env node
var fs = require('fs');
var express = require('express');
var cors = require('cors');

var routes = require('./routes');
var mongoose = require('mongoose');
var User = require('./models/user');

var bodyParser = require('body-parser');
var connectionString = `mongodb://sa:${process.env.MONGO_PASS}@pricegurudb-shard-00-00-f7dah.gcp.mongodb.net:27017,pricegurudb-shard-00-01-f7dah.gcp.mongodb.net:27017,pricegurudb-shard-00-02-f7dah.gcp.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=PriceguruDB-shard-0&authSource=admin&retryWrites=true`;
mongoose.connect(connectionString,{useCreateIndex: true,useNewUrlParser: true});
var app = express();
var port = process.env.PORT || 433;
 
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

app.use(cors());

app.use((req,res,next)=>{
  res.set('Access-Control-Expose-Headers','X-OBSERVATORY-AUTH');
  next();
});

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


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
  
  server = http.createServer(app);


  app.use('/', routes);
}

// Turn on that server!
server.listen( port, () => {
  console.log(`App listening on port ${port}`);
}); 

module.exports = app