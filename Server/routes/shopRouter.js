'use strict'
const routes = require('express').Router();

const ShopController = require("../controllers/ShopController");
const shopController = new ShopController();

const IdentityController = require("../controllers/IdentityController");
const identityController = new IdentityController();

routes.get('/', async (req, res, next) => {
    await shopController.GetShop(req, res);
});

routes.post('/', async (req, res, next) => {
    let isloggedon = await identityController.IsLoggedOn(req, res);
    if (isloggedon) {
        await shopController.PostShop(req, res);
    }
});

routes.get('/:id', async (req, res, next) => {
    await shopController.GetShopById(req, res);
});


routes.put('/:id', async (req, res, next) => {
    let isloggedon = await identityController.IsLoggedOn(req, res);
    if (isloggedon) {
        await shopController.PutShop(req, res);

    }
});

routes.patch('/:id', async (req, res, next) => {
    let isloggedon = await identityController.IsLoggedOn(req, res);
    if (isloggedon) {
        await shopController.PatchShop(req, res);
    }
});

routes.delete('/:id', async (req, res, next) => {
    await shopController.DeleteShop(req, res);
});

module.exports = routes;