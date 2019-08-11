const PastebinAPI = require('pastebin-js');

module.exports = class PastebinApi {
    constructor(client) {
        this.name = 'LoaderPastebinAPI'
        this.client = client
        this.ENVS = {
            api_dev_key: JSON.parse(process.env.PASTEBIN_API)['DEV_KEY'],
            api_user_name: JSON.parse(process.env.PASTEBIN_API)['USER_NAME'],
            api_user_password: JSON.parse(process.env.PASTEBIN_API)['USER_PASSWORD']
        }
    }

    async  call() {
        return this.loadPastebin().then(() => {
            this.client.pastebinAPI = this
            this.client.LOG('PastebinAPI successfully loaded', 'LoaderPastebinAPI')
        });
    }

    async loadPastebin() {
        const { api_dev_key, api_user_name, api_user_password } = this.ENVS
        this.PASTEBIN = new PastebinAPI({
            api_dev_key,
            api_user_name,
            api_user_password
        })
        return true;
    }

    async post(text, title, format, privacy, expiration) {
        return await this.PASTEBIN.createPaste(text, title, format, privacy, expiration);
    }

    async get(id) {
        return await this.PASTEBIN.getPaste(id);
    }
}