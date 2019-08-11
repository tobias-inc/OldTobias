const Event = require("../../structures/Event.js");

module.exports = class MessageUpdate extends Event {
    constructor(client) {
        super(client)
        this.client = client
        this.name = 'messageUpdate'
    }

    async ON(oldM, newM) {
        if (!(newM.edits.length > 2 || oldM.author.bot)) {
            if (!(oldM.content == newM.content) && newM.content.trim().length) this.client.emit('message', newM);
        }
    }
}