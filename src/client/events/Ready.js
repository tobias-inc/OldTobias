const Event = require("../../structures/Event.js");

const SLEEP = () => Number((Math.random() * (60 - 30) + 30).toFixed(0) + '000');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client)
        this.client = client
        this.client.updatePresence = (param) => this.PRESENCE(param);
        this.name = 'ready'
    }

    async ON() {
        await this.ShardManager();

        const timeOut = (ms) => setTimeout(UPDATE_PRESENCE, ms);
        const UPDATE_PRESENCE = async () => {
            const RESPONSE = await new Promise(async (resolve, rejection) => {
                try {
                    resolve(await this.PRESENCE())
                } catch (error) {
                    rejection({ err: true, error })
                }
            })
            console.log(
                (RESPONSE.err
                    ? `\x1b[31m[SHARD ${(this.client.shard.id + 1)} - ERROR_PRESENCE]\x1b[0m`
                    : `\x1b[34m[SHARD ${(this.client.shard.id + 1)} - PRESENCE_UPDATE]\x1b[0m`),
                (RESPONSE.err ? RESPONSE.error : JSON.stringify(RESPONSE.localPresence.game))
            )
            return timeOut(SLEEP());
        }

        return timeOut();
    }

    async PRESENCE(GC, text) {
        const users = await this.client.ShardUtils.getMembersSize();
        const guilds = await this.client.shard.broadcastEval('this.guilds.size').then(res => res.reduce((a, b) => a + b, 0));

        if (this.client.user.presence.game && !!this.client.user.presence.game.name.match(/servers+/gi) && !GC) {
            text = ` 🧍 ${users} Users`
            this.client.RandomMatch.type = 0
        } else {
            text = ` 🖥️ ${guilds} Servers`
            this.client.RandomMatch.type = 0
        }

        return await this.client.user.setPresence({
            game: {
                name: `${text} || ${
                    this.client.RandomMatch.txt
                        .replace('{{user}}', this.client.user.username)
                    }`,
                type: this.client.RandomMatch.type,
                url: this.client.RandomMatch.url
            },
            status: this.client.RandomMatch.status
        })
    }

    async ShardManager() {
        this.client.ShardUtils = {
            getMembersSize: async () => {
                return await this.client.shard.broadcastEval(`
                    let count = 0;
                    this.guilds.forEach(g=> count += g.memberCount);
                    count;
                `).then((res => res.reduce((a, b) => a + b, 0)));
            },
            getGuildsSize: async () => {
                return await this.client.shard.broadcastEval('this.guilds.size')
                    .then((res => res.reduce((a, b) => a + b, 0)));
            },
            send: async (guild, channel, msg) => {
                if (this.client.guilds.get(guild)) {
                    try {
                        return this.client.guilds.get(guild).channels.get(channel).send(msg);
                    } catch (err) { }
                } else {
                    msg = typeof msg === 'string' ? `'${msg}'` : JSON.stringify({ "embed": msg });
                    return this.client.shard.broadcastEval(`
                        try {
                            let guild = this.guilds.get('${guild}');
                            if (guild && guild.channels.get('${channel}')) {
                                guild.channels.get('${channel}').send(${msg})
                            }
                        } catch (err) { }
                    `).then(() => true).catch(() => false);
                }
            },
            getSharedServers: async (user) => {
                return await this.client.shard.broadcastEval(`
                    try {
                        this.guilds.filter(guild => guild.member('${user.id}')).map(guild => guild.name)
                    } catch (err) { }
                `).then((result) => {
                    // filter the results 'undefinded'
                    result = result.filter(res => res);
                    const ARR = [];
                    // unpack
                    if (result) {
                        Promise.all(result.map(g => {
                            if (Array.isArray(g)) {
                                g.map(map => ARR.push(map));
                            } else {
                                ARR.push(g);
                            }
                        }))
                    }
                    return ARR;
                })
            }
        }
        return true;
    }
}

process.on('unhandledRejection', (rej) => {
    console.error(
        `-\n\n==========unhnadledRejection==========\nRejeição não Tratada:\n${rej.stack}\n==================================\n\n-`
    )
}).on('uncaughtException', (ex) => {
    console.error(
        `-\n\n==========uncaughtException==========\n${ex}\n${ex.stack}\n==================================\n\n-`
    )
});