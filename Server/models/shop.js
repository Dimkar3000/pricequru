const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const shopSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    address: String,
    location: {
        type: [Number],
        index: '2dsphere'
    },
    tags: [String],
    withdrawn: Boolean
    
});
shopSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Shop', shopSchema);