const templates = require("../JSON/CanvasTemplates.json").templates

module.exports = class TemplatesUtils {
    constructor(client) {
        this.client = client
    }

    setTemplates() {
        for (const template of templates) {
            template['run'] = async (...args) => { return await this[template.function](...args) };
            this.templates.types.push(template);
        }
        return true;
    }
}