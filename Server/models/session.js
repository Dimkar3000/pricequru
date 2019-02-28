const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    username: String,
    key: String,
    isAdmin: Boolean,
    createdAt: {
        type:Date,
        expires: '1d',
        default: Date.now
    }
});

module.exports = mongoose.model('Session',sessionSchema);