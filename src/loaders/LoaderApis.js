const { readdirSync } = require("fs");

module.exports = class ClientApis {
    constructor(client) {
        this.name = 'ClientApis'
        this.client = client
        this.apis = {}
    }

    async call() {
        this.client.apis = this;
        return await this.loaderApis().then(() => {
            this.client.apis = this.apis;
            this.client.LOG('Module loaded successfully without any errors', 'LoaderApis')
        });
    }

    async loaderApis(dir = 'src/apis') {
        const apis = await readdirSync(dir)
        return apis.forEach(api => {
            try {
                const required = new (require(`../../${dir}/${api}`))();
                required.load();
                this.apis[required.name] = required;
            } catch (err) {
                throw err;
            }
        })
    }
}