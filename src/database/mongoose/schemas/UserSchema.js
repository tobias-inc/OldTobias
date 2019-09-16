const { Schema } = require('mongoose');

const PremiumSettings = {
    textcolor: '#000000',
    fontFamily: 'Arial'
}

const UtilsSettings = {
    copyEmojis: []
}
const VipSettings = {
        active: false,
        notifier: true
}
const ContributorSettings = {
    redirect: 'None',
    owner: false,
    developer: false,
    donator: false,
    translater: false,
    designer: false
}

const votesSettings = {
    BPD: {
        active: false,
        date: 0,
        numVotes: 0
    },
    DBL: {
        active: false,
        date: 0,
        numVotes: 0
    }
}

module.exports = new Schema({
    _id: {
        type: String
    },
    contributor: {
        type: Object,
        default: ContributorSettings
    },
    usedCommands: {
        type: Number,
        default: 0
    },
    premiumUtils: {
        type: Object,
        default: PremiumSettings
    },
    utils: {
        type: Object,
        default: UtilsSettings
    },
    blacklist: {
        type: Boolean,
        default: false
    },
    votes: {
        type: Object,
        default: votesSettings
    },
    vip: {
        type: Object,
        default: VipSettings
    },
    coins:{
        type: Number,
        default: 0
    },
})