'use strict'
const routes = require('express').Router();
const productsRouter = require('./productRouter');
const shopRouter = require('./shopRouter');

const IdentityController = require("../controllers/IdentityController");
const identityController = new IdentityController();

const PriceController = require("../controllers/PriceController");
const priceController = new PriceController();

const baseAddress = '/observatory/api';

const User = require('../models/user')


routes.get(`${baseAddress}/init`, (req, res, next) => {
    console.log("init")
    new User({ username: "admin", password: "1234!" }).save()
    new User({ username: "user", password: "pass" }).save()
    res.end()
})

routes.post(`${baseAddress}/login`, async (req, res, next) => {
    await identityController.Login(req, res);
})

routes.post(`${baseAddress}/register`, async (req, res, next) => {
    await identityController.Register(req, res);
});


routes.post(`${baseAddress}/logout`, async (req, res, next) => {
    await identityController.Logout(req, res);
});

routes.get(`${baseAddress}/prices`, async (req, res, next) => {
    await priceController.GetPrice(req, res);
});


routes.post(`${baseAddress}/prices`, async (req, res, next) => {
    let isloggedon = await identityController.IsLoggedOn(req, res);
    if (isloggedon) {
        await priceController.PostPrice(req, res);
    }
});

routes.use(`${baseAddress}/products`, productsRouter);

routes.use(`${baseAddress}/shops`, shopRouter);


module.exports = routes