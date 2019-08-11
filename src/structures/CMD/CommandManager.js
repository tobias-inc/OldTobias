const moment = require('moment');
require("moment-duration-format");

module.exports = class CommandUtils {
    constructor(client) {
        this.client = client
    }

    getRamUsage() {
        const MemoryHeapUsed = (((process.memoryUsage().heapUsed) / 1024 / 1024).toFixed(2));
        return MemoryHeapUsed + ' MB';
    }

    async getGuildsSize(lang) {
        const guilds = await this.client.ShardUtils.getGuildsSize();
        return Number(guilds).localeNumber(lang);
    }

    async getUsersSize(lang) {
        const users = await this.client.ShardUtils.getMembersSize();
        return Number(users).localeNumber(lang);
    }

    async getPing() {
        let ping = await this.client.shard.broadcastEval('this.ping');
        ping = ping[this.client.shard.id].toFixed(0);
        return ping + ' MS';
    }

    async getShard() {
        return (`${(this.client.shard.id + 1)}/${this.client.shard.count}`);
    }

    async getCommandsUsages(lang) {
        let usages = await this.client.database.comandos.findAll();
        usages = usages.map(t => t.usages).reduce((prev, val) => prev + val, 0);
        return Number(usages).localeNumber(lang);
    }

    getTime(time = { send: false, ms: this.client.uptime }) {
        return `**${moment.duration(time.ms, 'milliseconds').format('d[d] h[h] m[m] s[s]', { stopTrim: 'd' })}**`;
    }
}