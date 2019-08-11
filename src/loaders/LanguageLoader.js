const { readdirSync } = require("fs");

const i18next = require('i18next');
const translationBackend = require('i18next-node-fs-backend');

module.exports = class ClientLanguage {
    constructor(client) {
        this.name = 'LanguageLoader'
        this.client = client
        this.language = {
            i18next: i18next,
            langsType: client.regionsLang.language,
            options: {
                aliases: [
                    {
                        aliase: [
                            "--help",
                            "--ajuda"
                        ],
                        help: true
                    },
                ],
                files: [],
            },
            LoaderLanguage: async () => { return await this.LoaderLanguage('src/locales') }
        }
    }

    async call() {
        this.client.language = this.language;
        return this.LoaderLanguage()
            .then(() => this.client.LOG('i18next initialized', 'LanguageSystem'));
    }

    async LoaderLanguage(dirPath = 'src/locales', rootDir = 'pt-BR') {
        const files = await readdirSync(dirPath + '/' + rootDir);
        const preloads = await readdirSync(dirPath);
        for (const file of files) this.client.language.options.files.push(file);

        return i18next
            .use(translationBackend)
            .init({
                ns: ['clientMessages', 'comandos', 'description', 'errors', 'utils'],
                preload: preloads,
                fallbackLng: rootDir,
                backend: {
                    loadPath: `${dirPath}/{{lng}}/{{ns}}.json`
                },
                interpolation: {
                    escapeValue: false
                },
                returnEmptyString: false
            })
            .then(() => this.setAliases(preloads));
    }

    setAliases(preloads, dir = 'src/locales/') {
        const langs = preloads;
        const requireFiles = this.client.language.options.files;
        const push = (lang) => {
            lang = lang.includes('-') ? [lang, lang.replace('-', '')] : lang;
            return this.client.language.options.aliases.push({
                aliase: lang,
                name: this.client.regionsLang.langContent[Array.isArray(lang) ? lang[0] : lang],
                type: Array.isArray(lang) ? lang[0] : lang
            })
        }

        return Promise.all(langs.map(async (lang) => {
            let trueFiles = 0;
            const path = await readdirSync(dir + lang);

            if (path.length === requireFiles.length) {
                for (let i = 0; i < path.length; i++) {
                    if (path[i] === requireFiles[i]) {
                        ++trueFiles
                    }
                }
                if (trueFiles === requireFiles.length) push(lang);
            }
        }))
    }
}