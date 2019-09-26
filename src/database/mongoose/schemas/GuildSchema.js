const { Schema } = require('mongoose');

module.exports = new Schema({
    _id: {
        type: String
    },
    language: {
        type: String,
        default: process.env.LANG_ROOT
    },
    prefix: {
        type: String,
        default: process.env.PREFIX
    }
})