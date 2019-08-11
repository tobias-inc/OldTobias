const { Aliases, Errors, Match, Regions, } = require("./utils/JSON/");
const { Client, Collection } = require("discord.js");
const Modules = require("./loaders/");

module.exports = class Tobias extends Client {
    constructor(settings = {}) {
        super(settings);
        this.Errors = Errors
        this.collection = Collection
        this.Aliases = Aliases
        this.RandomMatch = Match
        this.regionsLang = Regions
        this.ShardUtils = false
        this.dbl = false
    }

    async connect(token = false) {
        token = token ? token : process.env.TOKEN ? process.env.TOKEN : this.Error('No token identify!')
        await this.initializeLoaders();
        return super.login(token).then(async () => {
            await this.database.clientUtils.get(this.user.id);
            this.emit('botlistevent')
        });
    }

    async initializeLoaders() {
        const loaders = Object.values(Modules);
        let loadeds = 0;
        for (const initialize of loaders) {
            const requirement = new initialize(this);
            try {
                await requirement.call();
                ++loadeds
            } catch (e) {
                this.LOG_ERR(e, requirement.name);
            }
        }
        return this.LOG(`I successfully loaded ${loadeds} modules from ${loaders.length} modules`, 'LOADERS')
    }

    LOG(...args) {
        const Sendlog = (args.length > 1 ? `\x1b[32m${args.map(t => `[${t}]`).slice(1).join(' ')}\x1b[0m` : '') + ` \x1b[34m${args[0]}\x1b[0m`
        console.log(Sendlog)
    }

    LOG_ERR(...args) {
        const error = args[0];
        const Sendlog = (args.length > 1 ? args.slice(1).map(t => `\x1b[33m[${t}]\x1b[0m`) : '')
        console.error('\x1b[31m[ERROR]\x1b[0m', ...Sendlog, error);
    }

    Error(err) {
        throw new Error(err.message ? err.message : err);
    }
}