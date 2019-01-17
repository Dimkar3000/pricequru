const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    category: String,
    tags: [String],
    withdrawn: Boolean

})

module.exports = mongoose.model('Product', sessionSchema);