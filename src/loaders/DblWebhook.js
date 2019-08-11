const DBL = require('dblapi.js');

module.exports = class DblWebhookLoader {
    constructor(client) {
        this.client = client
        this.dbl = false
        this.name = 'DblWebhookLoader'
    }

    call() {
        this.client.dbl = this.dbl
        return this.loaderDbl()
    }

    async loaderDbl() {
        try {
            this.client.dbl = new DBL(process.env.DBL_TOKEN, { webhookPort: 2333, webhookAuth: 'password' });
            return this.listen();
        } catch (e) {
            throw this.client.LOG_ERR(e, this.name, true);
        }
    }

    listen() {
        this.client.dbl.webhook.on('ready', hook => {
            this.client.LOG(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`, this.name);
        });
    }
}