const mongoose = require('mongoose');

const priceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    price: Number,
    dateFrom: Date,
    dateTo: Date,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop'
    }
    
});

module.exports = mongoose.model('Price', priceSchema);