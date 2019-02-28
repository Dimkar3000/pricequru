'use strict'
var routes = require('express').Router()
var mongoose = require('mongoose')
var Product = require('../models/product')
var responses = require('../DTOs/responses')
var Session = require('../models/session')

function sanitizeProduct(p) {
    return {
        id:p._id,
        name:p.name,
        description:p.description,
        tags:p.tags,
        withdrawn:p.withdrawn
    }
}

routes.get('/',async (req,res,next) => {
    console.log("GET /product")
    console.log(req.query)
    let start = parseInt(req.query.start,10)
    if(!start) start = 0
    let count = parseInt(req.query.count,10)
    if(!count) count = 20
    let status = req.query.status
    if(!status) status = "ACTIVE"
    let sort = req.query.sort
    if(!sort) sort = "id|DESC"
    
    let response = {
        start: start, 
        count: count,
        total: start + count, 
        products: []
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
    console.log(querry)
    await Product.paginate(querry,option).then(result =>{
        //console.log(result)
        
        response.products = result.docs.map(sanitizeProduct)
        response.total = result.total
        // console.log(response)
        res.json(response).end()
    })

})

routes.post('/',(req,res,next) => {
    console.log("POST /product")
    // console.log(req.body)
    let name = req.body.name
    let description = req.body.description
    let category = req.body.category
    let tags = req.body.tags
    if(typeof tags === "string"){
        tags = [tags]
    }
    let withdrawn = req.body.withdrawn === 'true'
    let id = new mongoose.mongo.ObjectId()
    let response = {
        id,
        name,
        description,
        category,
        tags,
        withdrawn,
        // Anything else
    }
    console.log(req.header('X-OBSERVATORY-AUTH'))
    console.log(JSON.stringify(response))
    // console.log(req.body.withdrawn)
    // Functionality Here
    /*
        1. Check Credentials
        2. If ok add the product
        3. Else return error code
    */

    if(!req.header('X-OBSERVATORY-AUTH')){
        console.log("here")
        res.status(401).end()
        return
    }

    Session.findOne({key:req.header('X-OBSERVATORY-AUTH')},(err,document) => {
        if(err || document===null){
            console.log("here2:",err,document)
            res.status(401).end()
            return
        }
        // User Authorized
        let product = new Product({
            _id: id,
            name,
            description,
            category,
            tags,
            withdrawn
        })
        product.save().then(s => {
            res.json(response).end()
        })
        // console.log(product)

    })

    
})

routes.get('/:id',(req,res,next) => {
     Product.findOne({_id:req.params.id},(err,product) => {
        if(err){
            res.status(500)
            res.end()
        }
        else if(product == null) {
            res.status(404)
            res.end()
        }
        else {
            var result = sanitizeProduct(product)
            res.json(result).end()
        }
    })
})


routes.put('/:id',(req,res,next) => {
    //console.log("PUT: "+ req.params.id)
    let name = req.body.name
    let description = req.body.description
    let category = req.body.category
    let tags = req.body.tags
    let withdrawn = req.body.withdrawn
    let id = req.params.id

    //console.log({name,description,category,tags,withdrawn})
    if(name == null || description == null || category == null || tags == null || withdrawn == null){
        res.status(404).end()
    }

    if(!req.header('X-OBSERVATORY-AUTH')){
        res.status(401).end()
        return
    }

    Session.findOne({key:req.header('X-OBSERVATORY-AUTH')},(err,document) => {
        if(err || document==null){
            res.status(401).end()
            return
        }
    
        Product.findOneAndUpdate({_id:id}, {
            name,
            description,
            category,
            tags,
            withdrawn
        },(err,product) => {
            if(err){
                res.status(500)
                res.end()
            }
            else if(product == null) {
                res.status(404)
                res.end()
            }
            else{
                var result = {id,name,description,category,tags,withdrawn}
                res.json(result).end()
            }

        })
    })
})

routes.patch('/:id',(req,res,next) => {
    //console.log("PATCH: "+ req.params.id)
    let name = req.body.name
    let description = req.body.description
    let category = req.body.category
    let tags = req.body.tags
    let withdrawn = req.body.withdrawn
    let id = req.params.id

    if(!req.header('X-OBSERVATORY-AUTH')){
        res.status(401).end()
        return
    }
    if(name == null && description == null && category == null && tags == null && withdrawn == null){
        res.status(404).end()
    }

    Session.findOne({key:req.header('X-OBSERVATORY-AUTH')},(err,document) => {
        if(err || document==null){
            res.status(401).end()
            return
        }
    

        //console.log({name,description,category,tags,withdrawn})
        
        let update = {}
        if(name != null){
            Object.assign(update,{name})
        } 
        if(description != null){
            Object.assign(update,{description})
        } 
        if(category != null){
            Object.assign(update,{category})
        } 
        if(tags != null){
            Object.assign(update,{tags})
        } 
        if(withdrawn != null){
            Object.assign(update,{withdrawn})
        } 
        if(Object.keys(update).length > 1) {
            res.status(404).end()
            return
        }

        Product.findOneAndUpdate({_id:id}, update,(err,product) => {
            if(err){
                res.status(500)
                res.end()
            }
            else if(product == null) {
                res.status(404)
                res.end()
            }
            else{
                let result = {}
                result.id = id 
                result.name = name
                result.description = description
                result.category = category
                result.tags = tags
                result.withdrawn = withdrawn
                if(result.name == null){
                    result.name = product.name
                }
                if(result.description == null){
                    result.description = product.description
                }
                if(result.category == null){
                    result.category = product.category
                }
                if(result.tags == null){
                    result.tags = product.tags
                }
                if(result.withdrawn == null){
                    result.withdrawn = product.withdrawn
                }
                res.json(result).end()
            }

        })
    })
})

routes.delete('/:id',(req,res,next) => {
    let id = req.params.id
    // if he is a user
    if(!req.header('X-OBSERVATORY-AUTH')){
        res.status(401).end()
        return
    }
    Session.findOne({key:req.header('X-OBSERVATORY-AUTH')},(err,document) => {
        if(err || document===null){
            res.status(401).end()
            return
        }
        if(!document.isAdmin){
            Product.findOneAndUpdate({_id:id}, {withdrawn:true},(err,f) => {
                res.json(responses.OK).end()
            })
        }
        else{
            // if he is a admin
            Product.findOneAndDelete({_id:req.params.id},(err,f) => {
                res.json(responses.OK).end()
            })
        }
        
    })
})

module.exports = routes