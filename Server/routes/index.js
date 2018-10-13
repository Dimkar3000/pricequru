const routes = require('express').Router();

const test = require('./test');

routes.get('/', (req, res) => {
  res.status(200).json({ message: 'Connected!' });
});

routes.use('/test', test)

module.exports = routes;