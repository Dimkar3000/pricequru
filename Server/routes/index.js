const routes = require('express').Router();

const test = require('./test');

routes.get('/', (req, res) => {
  if (req.session.views) {
    req.session.views++
    res.setHeader('Content-Type', 'text/html')
    res.write('<p>views: ' + req.session.views + '</p>')
    res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
    res.end()
  } else {
    req.session.views = 1
    req.session.cookie.maxAge = 1000
    res.end('welcome to the session demo. refresh!')
  }
});

routes.use('/test', test)


module.exports = routes;