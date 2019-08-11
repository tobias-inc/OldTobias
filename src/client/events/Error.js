const Event = require("../../structures/Event.js");

module.exports = class ErrorEvent extends Event {
    constructor(client) {
        super(client)
        this.client = client
        this.name = 'error'
    }

    async ON(error) {
        this.client.LOG_ERR(error);
        process.exit(1)
    }
}