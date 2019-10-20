const { Schema } = require('mongoose');


const channelSetings = {
    on: false,
    id: 0
}
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
    },
    channel: {
        type: Object,
        default: channelSetings
    }
})