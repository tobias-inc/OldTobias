const { readdirSync } = require("fs");

module.exports = class ClientEvents {
    constructor(client) {
        this.name = 'EventsLoader'
        this.client = client
        this.events = new client.collection
    }

    async call() {
        this.client.events = this.events;
        return this.LoaderEvents()
            .then(() => this.client.LOG('Module loaded successfully without any errors', 'EventsLoader'));
    }

    async LoaderEvents(evtPath = "src/client/events") {
        const files = await readdirSync(evtPath);
        return Promise.all(files.map(async evt => {
            const required = require('../client/events/' + evt);
            delete require.cache[require.resolve(`../client/events/${evt}`)]
            const event = new required(this.client);
            this.client.on(event.name, (...args) => event.ON(...args));
        }));
    }
}