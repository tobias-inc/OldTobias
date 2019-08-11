module.exports = class ClientCanvas {
    constructor(client) {
        this.name = 'CanvasLoader'
        this.client = client
        this.canvas = {
            loaders: {
                canvas: false,
                templates: false
            },
            templates: false
        }
    }

    async call() {
        this.client.canvas = this.canvas;
        return this.loaderCanvas().then((res) => {
            this.client.canvas.loaders.templates = res
            this.client.LOG('Canvas successfully loaded', 'CanvasLoader');
        })
    }

    async loaderCanvas(err = false) {
        return new Promise(async (resolve, reject) => {
            try {
                require("../utils/canvas/Utils.js").loaderUtils();
            } catch (err) {
                err = err
            } finally {
                if (err) reject(err);
                this.client.canvas.loaders.canvas = true
                resolve(this.loadTemplates());
            }
        })
    }

    async loadTemplates() {
        try {
            const Templates = require("../utils/canvas/Templates.js");
            const loadTemplates = new Templates(this.client);
            await loadTemplates.load().then(() => {
                this.client.canvas.templates = loadTemplates.templates
            });
            return true;
        } catch (err) {
            this.client.LOG_ERR(err, this.name);
            return false;
        }
    }
}