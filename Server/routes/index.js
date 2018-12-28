'use strict'
var routes = require('express').Router();
var mongoose = require('mongoose');

var responses = require('../DTOs/responses');

const User = require('../models/user');
const Session = require('../models/session');

routes.post('/observatory/api/login',(req,res) => {
  if(req.header('X-OBSERVATORY-AUTH')){
    res.status(401).end();
    return;
  }
  Session.findOne({username:req.body.username},(err,document) => {
    if(err || document==null){
      User.findOne({username:req.body.username},(err,user) => {
        if(err){
          console.log(err)
        }
        else if(user == null){
          res.status(401).end()
        }
        else{
          if(user.password == req.body.password) {
            let id = new mongoose.mongo.ObjectId();
            let session = new Session({
              _id: id,
              username: user.username,
              isAdmin: user.isAdmin,
            });
            res.set('X-OBSERVATORY-AUTH',id)
            session.save();
            res.json(responses.OK)
          }
        }
      });
    }
    else{
      res.set('X-OBSERVATORY-AUTH',document.id)
      res.json(responses.OK)
    }
  });
})
  
routes.post('/observatory/api/logout',(req,res) => {
  let auth = req.header('X-OBSERVATORY-AUTH');
  if(auth!= null){
    Session.findByIdAndDelete({_id:auth})
    res.json(responses.OK)
  }
  else {
    res.status(401).end()
  }
})

var productsRouter = require('./productRouter');
routes.use('/observatory/api/products',productsRouter)

var shopRouter = require('./shopRouter');
routes.use('/observatory/api/shops',shopRouter)

module.exports = routes;