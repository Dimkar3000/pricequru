'use strict'
var routes = require('express').Router()
var mongoose = require('mongoose')
var responses = require('../DTOs/responses')

const baseAddress = '/observatory/api'
const User = require('../models/user')
const Session = require('../models/session')
const Price = require('../models/price')
const Product = require('../models/product')
const Shop = require('../models/shop')

routes.post(`${baseAddress}/login`, (req, res) => {
    if (req.header('X-OBSERVATORY-AUTH')) {
        res.status(401).end()
        return
    }
    Session.findOne({ username: req.body.username }, (err, document) => {
        if (err || document == null) {
            User.findOne({ username: req.body.username }, (err, user) => {
                if (err) {
                    console.log(err)
                }
                else if (user == null) {
                    console.log(user)
                    console.log(req.body)
                    res.status(401).end()
                }
                else {
                    if (user.password == req.body.password) {
                        let id = new mongoose.mongo.ObjectId()
                        let session = new Session({
                            _id: id,
                            username: user.username,
                            isAdmin: user.isAdmin,
                        })
                        res.set('X-OBSERVATORY-AUTH', id)
                        session.save()
                        res.json(responses.OK)
                    }
                }
            })
        }
        else {
            res.set('X-OBSERVATORY-AUTH', document.id)
            res.json(responses.OK)
        }
    })
})

routes.post(`${baseAddress}/logout`, (req, res) => {
    let auth = req.header('X-OBSERVATORY-AUTH')
    if (auth != null) {
        Session.findByIdAndDelete({ _id: auth })
        res.json(responses.OK)
    }
    else {
        res.status(401).end()
    }
})

const productsRouter = require('./productRouter')
routes.use(`${baseAddress}/products`, productsRouter)

const shopRouter = require('./shopRouter')
routes.use(`${baseAddress}/shops`, shopRouter)

routes.get(`${baseAddress}/prices`, async (req, res) => {
    //console.log(req.query)
    //pagination properties 
    let start = parseInt(req.query.start, 10)
    if (!start) start = 0
    let count = parseInt(req.query.count, 10)
    if (!count) count = 20
    let sort = req.query.sort
    if (!sort) sort = "id|DESC"

    // arguments

    // Shops,Products can be an array or single value. 
    // After this check they will always be an array
    let shops = req.query.shops
    if (!Array.isArray(shops)) shops = [shops]
    let products = req.query.products
    if (!Array.isArray(products)) products = [products]
    let tags = req.query.tags
    if (!Array.isArray(tags)) tags = [tags]

    // GeoLocation variable should either all be null or all exist
    let geoDist = req.query.geoDist
    let geoLng = req.query.geoLng
    let geoLat = req.query.geoLat

    let geoQ = [geoDist, geoLat, geoLng]
    if (geoQ.some(e => { return e === undefined }) && geoQ.some(e => { return e !== undefined })) {
        let response = responses.WRONG_INPUT
        response.info = "geoDist, geoLat, geoLng should either all exist or all be absent"
        res.status(422).json(responses.WRONG_INPUT).end()
    }

    // Date From/To should both exist or both be absent
    let dateFrom = req.query.dateFrom
    let dateTo = req.query.dateTo

    let dateQ = [dateFrom, dateTo]
    if (dateQ.some(e => { return e === undefined }) && dateQ.some(e => { return e !== undefined })) {
        let response = responses.WRONG_INPUT
        response.info = "dateFrom, dateTo should either all exist or all be absent"
        res.status(422).json(responses.WRONG_INPUT).end()
        return;
    }
    else if (dateQ.every(e => { return e === undefined })) {
        dateFrom = new Date(Date.now());
        dateTo = new Date(Date.now());
    }
    else {
        dateFrom = new Date(dateFrom)
        dateTo = new Date(dateTo)
    }

    // Functionality Here
    let mode = sort.toLowerCase()
    let querry = {}
    let options = {}

    // The the sort type
    if (mode == "id|asc") {
        Object.assign(options, { sort: { _id: "asc" } })
    }
    else if (mode == "id|desc") {
        Object.assign(options, { sort: { _id: "desc" } })
    }
    else if (mode == "name|asc") {
        Object.assign(options, { sort: { name: "asc" } })
    }
    else if (mode == "name|desc") {
        Object.assign(options, { sort: { name: "desc" } })
    }
    else {
        return []
    }

    let shopQuery = {
        $geoNear: {
            spherical: true,
            distanceField: "distance",
            maxDistance: parseFloat(geoDist) * 1000 ,
            distanceMultiplier: 0.001,
            near: {
                type: "Point",
                coordinates: [parseFloat(geoLng), parseFloat(geoLat)]
            }
        }
    }
    console.log(shopQuery.$geoNear.near)


    // If GeoQuerry
    let shopDBQ = [ {$match: {"withdrawn": false,}}, {$project: { _id: 1 }}]
    if (geoQ.some(e => { return e !== undefined })) {
        shopDBQ.unshift(shopQuery)
    }
    let shopsDb = await Shop.aggregate(shopDBQ)


    if (shops[0] !== undefined) {
        shopsDb = shopsDb.filter(e => e._id in shops).map(e => { return e._id })
    }
    else {
        shopsDb = shopsDb.map(e => { return e._id })
    }
    // console.log(shops)

    let popoulateOptions = {
        path: 'productId shopId',
        match: { withdrawn: false },
        select: '_id name tags address'
    }
    let findOptions = {
        shopId: {
            $in: shopsDb
        },
        $and: [
            {
                dateFrom: {
                    $lte: dateTo
                }
            },
            {
                dateTo:
                {
                    $gte: dateFrom
                }
            }
        ]
    }
    // console.log(dateFrom,dateTo)

    Price.find(findOptions).populate(popoulateOptions).skip(start)
        .limit(count).sort(options.sort).exec((err, doc) => {
            // Check productId in products
            let final = doc.filter(e => { return e.productId !== null })
            if (products[0] !== undefined) {
                final = final.filter(e => {
                    products = products.map(JSON.stringify)
                    return products.indexOf(JSON.stringify(e.productId._id)) > -1
                })
            }
            // Check any productTags exits 
            if (tags[0] !== undefined) {
                final = final.filter(x => {
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
                total: final.length,
                prices: []
            }
            result.prices = sanitizePrices(final).then(r => { res.json(r).end() })
        })

})

async function sanitizePrices(final) {
    let r = final.map(e => {
        return {
            price: e.price,
            date: new Date().toISOString().split('T')[0],
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

routes.post(`${baseAddress}/price`, (req, res) => {
    let price = req.body.price
    let dateFrom = new Date(req.body.dateFrom)
    let dateTo = new Date(req.body.dateTo)
    let productId = mongoose.Types.ObjectId(req.body.productId)
    let shopId = mongoose.Types.ObjectId(req.body.shopId)
    let id = new mongoose.mongo.ObjectId()


    let response = {
        id,
        price,
        dateFrom: req.body.dateFrom,
        dateTo: req.body.dateTo,
        productId,
        shopId
    }
    // Functionality Here
    /*
        1. Check Credentials
        2. If ok add the product
        3. Else return error code
    */
    if (!req.header('X-OBSERVATORY-AUTH')) {
        res.status(401).end()
        return
    }

    Session.findOne({ _id: req.header('X-OBSERVATORY-AUTH') }, (err, document) => {
        if (err || document == null) {
            res.status(401).end()
            return
        }
        // User Authorized
        let priceObj = new Price({
            _id: id,
            price,
            dateFrom,
            dateTo,
            productId,
            shopId
        })
        priceObj.save()

        res.json(response).end()

    })


})

module.exports = routes