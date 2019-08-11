const Event = require("../../structures/Event.js");

module.exports = class WarnEvent extends Event {
    constructor(client) {
        super(client)
        this.client = client
        this.name = 'warn'
    }

    async ON(warn) {
        this.client.LOG_ERR(warn);
    }
}