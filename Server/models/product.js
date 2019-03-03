const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    description: String,
    category: String,
    extraData: Object,
    tags: [String],
    withdrawn: Boolean

})
productSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Product', productSchema);