'use strict'
const routes = require('express').Router();

const ProductController = require("../controllers/ProductController");
const productController = new ProductController();

const IdentityController = require("../controllers/IdentityController");
const identityController = new IdentityController();

routes.get('/', async (req, res, next) => {
    await productController.GetProduct(req, res);
});

routes.post('/', async (req, res, next) => {
    let isloggedon = await identityController.IsLoggedOn(req, res);
    if (isloggedon) {
        await productController.PostProduct(req, res);
    }
});

routes.get('/:id', async (req, res, next) => {
    await productController.GetProductById(req, res);
});


routes.put('/:id', async (req, res, next) => {
    let isloggedon = await identityController.IsLoggedOn(req, res);
    if (isloggedon) {
        await productController.PutProduct(req, res);
    }
});

routes.patch('/:id', async (req, res, next) => {
    let isloggedon = await identityController.IsLoggedOn(req, res);
    if (isloggedon) {
        await productController.PatchProduct(req, res);
    }
});

routes.delete('/:id', async (req, res, next) => {
    // Credential handled internally 
    await productController.DeleteProduct(req, res);
});

module.exports = routes