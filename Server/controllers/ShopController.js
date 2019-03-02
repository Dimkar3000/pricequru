'use strict';
const Shop = require('../models/shop');
const mongoose = require('mongoose');
const responses = require('../DTOs/responses');
const Session = require('../models/session');

function sanitizeShop(p) {
    return {
        id: p._id.toHexString(),
        name: p.name,
        address: p.address,
        lng: p.location[0],
        lat: p.location[1],
        tags: p.tags,
        withdrawn: p.withdrawn
    }
}

module.exports = class ShopController {
    async GetShop(req, res) {
        // console.log(req.query)
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
            shops: []
        }
        // Functionality Here
        let mode = sort.toLowerCase()
        let querry = {}
        let option = { offset: start, limit: count }

        // The the sort type
        if (mode == "id|asc") {
            Object.assign(option, { sort: { _id: "asc" } })
        }
        else if (mode == "id|desc") {
            Object.assign(option, { sort: { _id: "desc" } })
        }
        else if (mode == "name|asc") {
            Object.assign(option, { sort: { name: "asc" } })
        }
        else if (mode == "name|desc") {
            Object.assign(option, { sort: { name: "desc" } })
        }
        else {
            return []
        }
        // Add to the querry the status filter
        status = status.toLowerCase()
        if (status == "active") {
            Object.assign(querry, { withdrawn: false })
        }
        else if (status == "withdrawn") {
            Object.assign(querry, { withdrawn: true })
        }

        await Shop.paginate(querry, option).then(result => {

            response.shops = result.docs.map(sanitizeShop)
            response.total = result.total
            console.log(response)
            res.json(response).end()
        })

    }

    async PostShop(req, res) {
        let name = req.body.name;
        let address = req.body.address;
        let lng = req.body.lng;
        let lat = req.body.lat;
        let tags = req.body.tags;
        if (typeof tags === "string") {
            tags = [tags]
        }
        let withdrawn = req.body.withdrawn === 'true';
        let id = new mongoose.mongo.ObjectId();
        console.log(withdrawn, req.body.withdrawn)
        let response = {
            id,
            name,
            address,
            lng,
            lat,
            tags,
            withdrawn,
        }

        let shop = new Shop({
            _id: id,
            name,
            address,
            location: [lng, lat],
            tags,
            withdrawn
        })
        let status = await shop.save()
        if (!status) {
            console.log("Failed to save product to db")
        }
        res.json(response).end()

    }

    async GetShopById(req, res) {
        Shop.findOne({ key: req.params.id }, (err, shop) => {
            if (err) {
                res.status(400)
                res.end()
            }
            else if (shop == null) {
                res.status(404)
                res.end()
            }
            else {
                var result = sanitizeShop(shop)
                res.json(result).end()
            }
        })
    }

    async PutShop(req, res) {
        let name = req.body.name;
        let address = req.body.address;
        let lng = req.body.lng;
        let lat = req.body.lat;
        let tags = req.body.tags;
        let withdrawn = req.body.withdrawn === 'true';

        // Request Should contain all values
        if ([name, address, lng, lat, tags, withdrawn].some((e) => { return e == null; })) {
            res.status(404).end();
        }

        await Shop.findOneAndUpdate({ _id: id }, {
            name,
            address,
            location: [lng, lat],
            tags,
            withdrawn
        }, (err, shop) => {
            if (err) {
                res.status(400).end();
                return;
            }
            else if (shop == null) {
                res.status(404).end();
                return;
            }
            else {
                var result = { id, name, description, category, tags, withdrawn }
                res.json(result);
                return;
            }

        })

    }

    async PatchShop(req, res) {
        let name = req.body.name;
        let address = req.body.address;
        let lng = req.body.lng;
        let lat = req.body.lat;
        let tags = req.body.tags;
        let withdrawn = req.body.withdrawn === 'true';

        if ([name, address, lng, lat, tags, withdrawn].every((e) => { return e == null; })) {
            res.status(404).end()
        }
        let update = {}
        if (name != null) {
            update.name = name;
        }
        if (address != null) {
            update.address = address;
        }
        if (lng != null && lat != null) {
            update.location = [lng, lat];
        }
        if (tags != null) {
            update.tags = tags;
        }
        if (withdrawn != null) {
            update.withdrawn = withdrawn;
        }
        if (Object.keys(update).length > 1) {
            res.status(404).end();
            return;
        }

        let shop = await Shop.findOneAndUpdate({ _id: id }, update);
        if (!shop) {
            res.status(400).end();
        }
        else {
            let result = {};
            result.id = id;
            result.name = name;
            result.address = address;
            result.lng = lng;
            result.lat = lat;
            result.tags = tags;
            result.withdrawn = withdrawn;
            if (result.name == null) {
                result.name = shop.name;
            }
            if (result.address == null) {
                result.address = shop.address;
            }
            if (result.lng == null) {
                result.lng = shop.location[0];
            }
            if (result.lat == null) {
                result.lat = shop.location[1];
            }
            if (result.tags == null) {
                result.tags = shop.tags;
            }
            if (result.withdrawn == null) {
                result.withdrawn = shop.withdrawn;
            }
            res.json(result);
        }
    }

    async DeleteShop(req, res) {
        let id = req.params.id

        let session = Shop.findOne({ _id: req.header('X-OBSERVATORY-AUTH') });

        if (!session) {
            res.status(401).end();
            return;
        }
        if (!session.isAdmin) {
            await Shop.findOneAndUpdate({ _id: id }, { withdrawn: true });
            res.json(responses.OK);
            return;
        }
        else {
            await Shop.findOneAndDelete({ _id: req.params.id });
            res.json(responses.OK);
            return;
        }
    }
}