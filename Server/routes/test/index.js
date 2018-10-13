const models = require('express').Router();

models.get('/', (req,res,next) => {
    req
    res.status(200).json({test:1})
});

module.exports = models;