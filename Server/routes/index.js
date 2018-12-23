var routes = require('express').Router();
var base64 = require('base-64');
var utf8 = require('utf8');

routes.get('/', (req, res) => {
  let h = req.get("X-OBSERVATORY-AUTH")
  let bytes = base64.decode(h);
  let text = utf8.decode(bytes).split('|');
  let username = text[0];
  let password = text[1];

  res.end(`HEADER: ${username},${password}`)
});




module.exports = routes;