'use strict';

var mongoose = require('mongoose')
var responses = require('../DTOs/responses')

const Session = require('../models/session')
const Price = require('../models/price')
const Product = require('../models/product')
const Shop = require('../models/shop')


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function sanitizePrices(final) {
    let r = final.map(e => {
        return {
            price: e.price,
            date: formatDate(e.date),
            productName: e.productId.name,
            productId: e.productId._id,
            productTags: e.productId.tags,
            shopId: e.shopId._id,
            shopName: e.shopId.name,
            shopTags: e.shopId.tags,
            shopAddress: e.shopId.address
        }
    })
    return r;
}

module.exports = class PriceController {
    async GetPrice(req, res) {
        //pagination properties 
        let start = parseInt(req.query.start, 10);
        if (!start) start = 0;
        let count = parseInt(req.query.count, 10);
        if (!count) count = 20;
        let sort = req.query.sort;
        if (!sort) sort = "id|DESC";

        // Shops,Products can be an array or single value. 
        // After this check they will always be an array
        let shops = req.query.shops;
        if (!Array.isArray(shops) && shops !== undefined) {
            shops = [shops];
        } else {
            shops = [];
        }
        let products = req.query.products;
        if (!Array.isArray(products) && products !== undefined) {
            products = [products];
        } else {
            products = [];
        }
        let tags = req.query.tags;
        if (!Array.isArray(tags)) tags = [tags];

        // GeoLocation variable should either all be null or all exist
        let geoDist = req.query.geoDist;
        let geoLng = req.query.geoLng;
        let geoLat = req.query.geoLat;

        let geoQ = [geoDist, geoLat, geoLng];
        if (geoQ.some(e => { return e === undefined }) && geoQ.some(e => { return e !== undefined })) {
            let response = responses.WRONG_INPUT;
            response.info = "geoDist, geoLat, geoLng should either all exist or all be absent"
            res.status(422).json(responses.WRONG_INPUT).end();
            return;
        }

        // Date From/To should both exist or both be absent
        let dateFrom = req.query.dateFrom;
        let dateTo = req.query.dateTo;

        let dateQ = [dateFrom, dateTo]
        if (dateQ.some(e => { return e === undefined }) && dateQ.some(e => { return e !== undefined })) {
            let response = responses.WRONG_INPUT;
            response.info = "dateFrom, dateTo should either all exist or all be absent"
            res.status(422).json(responses.WRONG_INPUT);
            return;
        }
        else if (dateQ.every(e => { return e === undefined })) {
            dateFrom = new Date(Date.now());
            dateTo = new Date(Date.now());
        }
        else {
            dateFrom = new Date(dateFrom);
            dateTo = new Date(dateTo);
        }

        let mode = sort.toLowerCase();
        let options = {};

        // The the sort type
        if (mode == "id|asc") {
            options.sort = { _id: "asc" };
        }
        else if (mode == "id|desc") {
            options.sort = { _id: "desc" };
        }
        else if (mode == "name|asc") {
            options.sort = { name: "asc" };
        }
        else if (mode == "name|desc") {
            options.sort = { name: "desc" };
        }
        else if (mode == "price|asc") {
            options.sort = { price: "asc" };
        }
        else if (mode == "price|desc") {
            options.sort = { price: "desc" };
        }

        let shopQuery = {};
        if (geoLng !== undefined && geoLng !== undefined) {
            shopQuery.$geoNear = {
                spherical: true,
                distanceField: "distance",
                maxDistance: parseFloat(geoDist) * 1000,
                distanceMultiplier: 0.001,
                near: {
                    type: "Point",
                    coordinates: [parseFloat(geoLng), parseFloat(geoLat)]
                }
            };
        }

        let popoulateOptions = {
            path: 'productId shopId',
            match: { withdrawn: false },
            select: '_id name tags address'
        };
        dateFrom.setHours(0);
        dateFrom.setMinutes(0);
        dateFrom.setSeconds(0);
        dateTo.setHours(23);
        dateTo.setMinutes(59);
        dateTo.setSeconds(59)
        let findOptions = {
            $and: [{ date: { $lte: dateTo, $gte: dateFrom} }]
        };
        if (shops[0] !== undefined) {
            findOptions.shopId = {
                $in: shops
            };
        }
        if (products[0] !== undefined) {
            findOptions.productId = {
                $in: products
            };
        }

        let price = await Price.find(findOptions)
            .populate(popoulateOptions)
            .skip(start)
            .limit(count).sort(options.sort);
        // Check any productTags exits 
        if (tags[0] !== undefined) {
            price = price.filter(x => {
                return x.productId.tags.some(e => {
                    return tags.indexOf(e) > -1
                }) || x.shopId.tags.some(e => {
                    return tags.indexOf(e) > -1
                })
            })
        }

        let result = {
            start,
            count,
            total: price.length,
            prices: []
        };
        result.prices = sanitizePrices(price);
        console.log(price)
        res.json(result);
    }

    async PostPrice(req, res) {
        let price = parseFloat(req.body.price);
        let dateFrom = new Date(req.body.dateFrom);
        let dateTo = new Date(req.body.dateTo);
        let productId = mongoose.Types.ObjectId(req.body.productId);
        let shopId = mongoose.Types.ObjectId(req.body.shopId);

        let product = await Product.findOne({ _id: productId });
        if (!product) {
            console.log("Product Not Found")
            res.status(400).end();
            return;
        }

        let shop = await Shop.findOne({ _id: shopId });
        if (!shop) {
            console.log("Shop Not Found")
            res.status(400).end();
            return;
        }

        let response = {
            start: 0,
            count: 0,
            total: 0,
            price: []
        };

        while (true) {
            if (dateFrom.getTime() > dateTo.getTime()) {
                break;
            }
            response.total += 1;
            response.count += 1;

            let priceRequest = new Price({
                _id: new mongoose.mongo.ObjectId(),
                price,
                date: dateFrom,
                productId,
                shopId
            });
            let priceObj = await priceRequest.save();
            if (!priceObj) {
                res.status(401).end();
                return;
            }
            response.price.push({
                price,
                date: req.body.dateTo,
                productName: product.name,
                productTags: product.tags,
                productId,
                shopId,
                shopName: shop.name,
                shopTags: shop.tags,
                shopAddress: shop.address,
                shopDist: 2
            })
            dateFrom.setDate(dateFrom.getDate() + 1);
            
        }
        res.json(response);
    }
}