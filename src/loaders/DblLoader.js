const DBL = require('dblapi.js');

module.exports = class DblLoader {
    constructor(client) {
        this.client = client
        this.dbl = false
    }

    async call() {
        return this.loaderDbl().then(() => {
            this.client.dbl = this.dbl;
            this.client.LOG('Module was successfully loaded!', 'DblLoader')
        });
    }

    async loaderDbl() {
        this.dbl = new DBL(process.env.DBL_TOKEN, {
            statsInterval: 900000
        }, this.client);
        return true;
    }
}