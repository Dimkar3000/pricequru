'use strict';

var mongoose = require('mongoose');
var Product = require('../models/product');
var responses = require('../DTOs/responses');
var Session = require('../models/session');

function sanitizeProduct(p) {
    return {
        id: p._id,
        category: p.category,
        name: p.name,
        description: p.description,
        extraData: p.extraData,
        tags: p.tags,
        withdrawn: p.withdrawn
    }
}

module.exports = class ProductController {
    async GetProduct(req, res) {
        let start = parseInt(req.query.start, 10);
        if (!start) start = 0;
        let count = parseInt(req.query.count, 10);
        if (!count) count = 20;
        let status = req.query.status;
        if (!status) status = "ACTIVE";
        let sort = req.query.sort;
        if (!sort) sort = "id|DESC";

        let response = {
            start: start,
            count: count,
            total: start + count,
            products: []
        };
        // Functionality Here
        let mode = sort.toLowerCase();
        let querry = {};
        let option = { offset: start, limit: count }

        // The the sort type
        if (mode == "id|asc") {
            option.sort = { _id: "asc" };
        }
        else if (mode == "id|desc") {
            option.sort = { _id: "desc" };
        }
        else if (mode == "name|asc") {
            option.sort = { name: "asc" };
        }
        else if (mode == "name|desc") {
            option.sort = { name: "desc" };
        }
        else {
            throw "Unreacheable";
        }

        // Add to the querry the status filter
        status = status.toLowerCase()
        if (status == "active") {
            querry.withdrawn = false;
        }
        else if (status == "withdrawn") {
            querry.withdrawn = true;
        }

        let dbResponse = await Product.paginate(querry, option);
        response.products = dbResponse.docs.map(sanitizeProduct)
        response.total = dbResponse.docs.length
        res.json(response).end()
    }
    async PostProduct(req, res) {
        let name = req.body.name;
        let description = req.body.description;
        let category = req.body.category;
        let extraData = req.body.extraData;
        let tags = req.body.tags;
        if (typeof tags === "string") {
            tags = [tags];
        }
        let withdrawn = req.body.withdrawn === 'true';
        let id = new mongoose.mongo.ObjectId();

        let response = {
            id,
            name,
            description,
            category,
            extraData,
            tags,
            withdrawn,
        }

        let product = new Product({
            _id: id,
            name,
            description,
            category,
            extraData,
            tags,
            withdrawn
        })
        let status = await product.save();
        if (!status) {
            console.log("Failed to save product to db")
        }
        res.json(response);
    }
    async GetProductById(req, res) {
        await Product.findOne({ _id: req.params.id }, (err, product) => {
            if (err) {
                res.status(400).end();
            }
            else if (product == null) {
                res.status(404).end();
            }
            else {
                var response = sanitizeProduct(product)
                res.json(response).end();
            }
        })
    }

    async PutProduct(req, res) {
        let name = req.body.name;
        let extraData = req.body.extraData;
        let description = req.body.description;
        let category = req.body.category;
        let tags = req.body.tags;
        let withdrawn = req.body.withdrawn === 'true';
        let id = req.params.id;

        // Request Should contain all values
        if (name == null || description == null || category == null || tags == null || withdrawn == null) {
            res.status(404).end();
        }

        await Product.findOneAndUpdate({ _id: id }, {
            name,
            extraData,
            description,
            category,
            tags,
            withdrawn
        }, (err, product) => {
            if (err) {
                res.status(400).end();
                return;
            }
            else if (product == null) {
                res.status(404).end();
                return;
            }
            else {
                var result = { id, name, description, category, tags, withdrawn, extraData }
                res.json(result);
                return;
            }
        })
    }
    async PatchProduct(req, res) {
        let name = req.body.name;
        let description = req.body.description;
        let category = req.body.category;
        let tags = req.body.tags;
        let withdrawn = req.body.withdrawn === 'true';
        let id = req.params.id;


        if (name == null && description == null && category == null && tags == null && withdrawn == null) {
            res.status(404).end();
        }

        let update = {}
        if (name != null) {
            update.name = name;
        }
        if (description != null) {
            update.description = description;
        }
        if (category != null) {
            update.category = category;
        }
        if (tags != null) {
            update.tags = tags;
        }
        if (withdrawn != null) {
            update.withdrawn = withdrawn;
        }

        if (Object.keys(update).length > 1) {
            res.status(404).end()
            return;
        }

        let product = await Product.findOneAndUpdate({ _id: id }, update);
        if (!product) {
            res.status(400).end();
        }
        else {
            let result = {};
            result.id = id;
            result.name = name;
            result.description = description;
            result.category = category;
            result.tags = tags;
            result.withdrawn = withdrawn;
            if (result.name == null) {
                result.name = product.name;
            }
            if (result.description == null) {
                result.description = product.description;
            }
            if (result.category == null) {
                result.category = product.category;
            }
            if (result.tags == null) {
                result.tags = product.tags;
            }
            if (result.withdrawn == null) {
                result.withdrawn = product.withdrawn;
            }
            res.json(result);
        }
    }
    async DeleteProduct(req, res) {
        let id = req.params.id;
        let session = await Session.findOne({ key: req.header('X-OBSERVATORY-AUTH') });
        if (!session) {
            res.status(401).end();
            return;
        }
        if (!session.isAdmin) {
            await Product.findOneAndUpdate({ _id: id }, { withdrawn: true });
            res.json(responses.OK);
            return;
        }
        else {
            await Product.findOneAndDelete({ _id: req.params.id });
            res.json(responses.OK);
            return;
        }
    }
}