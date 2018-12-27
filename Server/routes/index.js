var routes = require('express').Router();
var base64 = require('base-64');
var utf8 = require('utf8');
var mongoose = require('mongoose');

const User = require('../models/user');

routes.get('/', (req, res) => {
  let h = req.get("X-OBSERVATORY-AUTH")
  let bytes = base64.decode(h);
  let text = utf8.decode(bytes).split('|');
  let username = text[0];
  let password = text[1];

  res.end(`HEADER: ${username},${password}`)
});

routes.get('/db',(req,res) => {
  var user =  new User({
      id : new mongoose.Types.ObjectId(),
      username : "user1",
      password : "1234"
  });
  user.save().then(result => {
    console.log(result);
  })
  .catch(err => console.log(err));

})




module.exports = routes;