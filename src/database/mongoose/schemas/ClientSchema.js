const { Schema } = require('mongoose');

module.exports = new Schema({
    _id: {
        type: String
    },
    maintence: {
        type: Boolean,
        default: false
    },
    voteds: {
        type: Array,
        default: []
    },
    removeVotes: {
        type: Array,
        default: []
    }
})