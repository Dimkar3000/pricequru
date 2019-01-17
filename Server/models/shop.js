const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    lng: Number,
    lat: Number,
    tags: [Strings],
    withdrawn: Boolean
    
});

module.exports = mongoose.model('Shop', shopSchema);