'use strict'
var routes = require('express').Router();

routes.get('/',(req,res) => {
    //console.log(req.query)
    let start = req.query.start;
    let count = req.query.count;
    let sort = req.query.sort;
    let status = req.query.status;

    let response = {
        start: start, 
        count: count,
        total: start + count, 
        shops: []
    }
    // Functionality Here
    

    res.json(response).end()
});

routes.post('/',(req,res) => {
    console.log(req.body);
    let name = req.body.name;
    let address = req.body.address;
    let lng = req.body.lng;
    let lat = req.body.lat;
    let tags = req.body.tags;
    let withdrawn = req.body.withdrawn;


    let response = {
        id:"long id string",
        name,
        address,
        lng,
        lat,
        tags,
        withdrawn,
        // Anything else
    }
    // Functionality Here
    /*
        1. Check Credentials
        2. If ok add the shop
        3. Else return error code
    */

    res.json(response).end()
});

routes.get('/:id',(req,res) => {
    console.log("GET: "+ req.params.id)
    res.end();
});


routes.put('/:id',(req,res) => {
    console.log("PUT: "+ req.params.id)
    res.end();
});

routes.patch('/:id',(req,res) => {
    console.log("PATCH: "+ req.params.id)
    res.end();
});

routes.delete('/:id',(req,res) => {
    console.log("DELETE: "+ req.params.id)
    res.end();
});

module.exports = routes;