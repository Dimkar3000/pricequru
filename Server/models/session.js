const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: String,
    isAdmin: Boolean,
    createdAt: {
        type:Date,
        expires: '1d',
        default: Date.now
    }
});

module.exports = mongoose.model('Session',sessionSchema);