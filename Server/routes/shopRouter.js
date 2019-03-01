'use strict'
const routes = require('express').Router();
const Shop = require('../models/shop');
const mongoose = require('mongoose');
const responses = require('../DTOs/responses');
const Session = require('../models/session');

function sanitizeShop(p) {
    return {
        id:p._id.toHexString(),
        name:p.name,
        address:p.address,
        lng: p.location[0],
        lat: p.location[1],
        tags:p.tags,
        withdrawn:p.withdrawn
    }
}

routes.get('/',async (req,res,next) => {
    // console.log(req.query)
    let start = parseInt(req.query.start,10);
    if(!start) start = 0;
    let count = parseInt(req.query.count,10);
    if(!count) count = 20;
    let status = req.query.status;
    if(!status) status = "ACTIVE";
    let sort = req.query.sort;
    if(!sort) sort = "id|DESC";
    
    let response = {
        start: start, 
        count: count,
        total: start + count, 
        shops: []
    }
    // Functionality Here
    let mode = sort.toLowerCase()
    let querry = {}
    let option = {offset:start,limit:count}
    
    // The the sort type
    if( mode == "id|asc"){
        Object.assign(option,{sort:{_id:"asc"}})
    }
    else if(mode == "id|desc"){
        Object.assign(option,{sort:{_id:"desc"}})
    }
    else if(mode == "name|asc"){
        Object.assign(option,{sort:{name:"asc"}})
    }
    else if(mode == "name|desc"){
        Object.assign(option,{sort:{name:"desc"}})
    }
    else {
        return []
    }
    // Add to the querry the status filter
    status = status.toLowerCase()
    if(status == "active"){
        Object.assign(querry,{withdrawn:false})
    }
    else if(status == "withdrawn") {
        Object.assign(querry,{withdrawn:true})
    }

    await Shop.paginate(querry,option).then(result =>{
        
        response.shops = result.docs.map(sanitizeShop)
        response.total = result.total
        console.log(response)
        res.json(response).end()
    })

});

routes.post('/',(req,res,next) => {
    console.log("POST /product")
    //console.log(req.body);
    let name = req.body.name;
    let address = req.body.address;
    let lng = req.body.lng;
    let lat = req.body.lat;
    let tags = req.body.tags;
    if(typeof tags === "string"){
        tags = [tags]
    }
    let withdrawn = req.body.withdrawn === 'true';
    let id = new mongoose.mongo.ObjectId();
    console.log(withdrawn,req.body.withdrawn)
    let response = {
        id,
        name,
        address,
        lng,
        lat,
        tags,
        withdrawn,
        // Anything else
    }

   if(!req.header('X-OBSERVATORY-AUTH')){
    res.status(401).end();
    return;
    }

    Session.findOne({key:req.header('X-OBSERVATORY-AUTH')},(err,document) => {
        if(err || document==null){
            res.status(401).end()
            return;
        }
        // User Authorized
        let shop = new Shop({
            _id: id,
            name,
            address,
            location:[lng,lat],
            tags,
            withdrawn
        })
        shop.save((rr,s) => {
            res.json(response).end()
        })


    })

});

routes.get('/:id',(req,res,next) => {
    Shop.findOne({key:req.params.id},(err,shop) => {
        if(err){
            res.status(500)
            res.end()
        }
        else if(shop == null) {
            res.status(404)
            res.end()
        }
        else {
            var result = sanitizeShop(shop)
            res.json(result).end()
        }
    })
});


routes.put('/:id',(req,res,next) => {
    let name = req.body.name;
    let address = req.body.address;
    let lng = req.body.lng;
    let lat = req.body.lat;
    let tags = req.body.tags;
    let withdrawn = req.body.withdrawn === 'true';

    if([name,address,lng,lat,tags,withdrawn].some((e) => {return e == null;})){
        res.status(404).end()
    }
    if(!req.header('X-OBSERVATORY-AUTH')){
        res.status(401).end();
        return;
    }

    Session.findOne({key:req.header('X-OBSERVATORY-AUTH')},(err,document) => {
        if(err || document==null){
            res.status(401).end()
            return;
        }


        
        Shop.findOneAndUpdate({_id:id}, {
            name,
            address,
            location: [lng,lat],
            tags,
            withdrawn
        },(err,shop) => {
            if(err){
                res.status(500)
                res.end()
            }
            else if(shop == null) {
                res.status(404)
                res.end()
            }
            else{
                var result = {id,name,description,category,tags,withdrawn}
                res.json(result).end()
            }

        })
    })

});

routes.patch('/:id',(req,res,next) => {
    let name = req.body.name;
    let address = req.body.address;
    let lng = req.body.lng;
    let lat = req.body.lat;
    let tags = req.body.tags;
    let withdrawn = req.body.withdrawn;

    if([name,address,lng,lat,tags,withdrawn].every((e) => {return e == null;})){
        res.status(404).end()
    }
    if(!req.header('X-OBSERVATORY-AUTH')){
        res.status(401).end();
        return;
    }

    Session.findOne({key:req.header('X-OBSERVATORY-AUTH')},(err,document) => {
        if(err || document==null){
            res.status(401).end()
            return;
        }
    
        let update = {}
        if(name != null){
            Object.assign(update,{name})
        } 
        if(address != null){
            Object.assign(update,{address})
        } 
        if(lng != null && lat != null){
            Object.assign(update,{location:[lng,lat]})
        } 
        if(tags != null){
            Object.assign(update,{tags})
        } 
        if(withdrawn != null){
            Object.assign(update,{withdrawn})
        } 
        if(Object.keys(update).length > 1) {
            res.status(404).end()
            return;
        }

        Shop.findOneAndUpdate({_id:id}, update,(err,shop) => {
            if(err){
                res.status(500)
                res.end()
            }
            else if(shop == null) {
                res.status(404).end()
            }
            else{
                let result = {}
                result.id = id 
                result.name = name
                result.address = address
                result.lng = lng
                result.lat = lat
                result.tags = tags
                result.withdrawn = withdrawn
                if(result.name == null){
                    result.name = shop.name
                }
                if(result.address == null){
                    result.address = shop.address
                }
                if(result.lng == null){
                    result.lng = shop.location[0]
                }
                if(result.lat == null){
                    result.lat = shop.location[1]
                }
                if(result.tags == null){
                    result.tags = shop.tags
                }
                if(result.withdrawn == null){
                    result.withdrawn = shop.withdrawn
                }
                res.json(result).end()
            }

        })
    })
});

routes.delete('/:id',(req,res,next) => {
    let id = req.params.id
    // if he is a user
    if(!req.header('X-OBSERVATORY-AUTH')){
        res.status(401).end();
        return;
    }

    Shop.findOne({_id:req.header('X-OBSERVATORY-AUTH')},(err,document) => {
        if(err || document==null){
            res.status(401).end()
            return;
        }
        if(!document.isAdmin){
            Shop.findOneAndUpdate({_id:id}, {withdrawn:true},(err,f) => {
                res.json(responses.OK).end()
            })
        }
        else{
            // if he is a admin
            Shop.findOneAndDelete({_id:req.params.id},(err,f) => {
                res.json(responses.OK).end()
            })
        }
        
    })
});

module.exports = routes;