module.exports = class VotesStructures {
    constructor(client) {
        this.client = client
        this.keys = {
            BPD: {
                api: "https://api.botsparadiscord.xyz/bots",
                url: "https://botsparadiscord.xyz/",
                name: "BotsParaDiscord",
                vipHours: {
                    h: 8,
                    ms: 28800000
                }
            },
            DBL: {
                url: "https://discordbots.org",
                name: "DiscordBotList",
                vipHours: {
                    h: 12,
                    ms: 43200000
                }
            }
        }
    }

    async removeVotes(removeVotes) {
        const parseType = [];
        for (const removed of removeVotes) {
            let { type, id } = removed;
            if (parseType.some(b => b.id == removed.id)) {
                if (parseType.some(b => b.id == removed.id && b.types.includes(type))) break;
                else {
                    let parse = parseType.find(b => b.id == id)
                    parse.types.push(type);
                }
            } else {
                parseType.push({
                    id,
                    types: [type]
                })
            }
        }

        parseType.forEach(async (user) => {
            const settings = [];
            const t = this.client.language.i18next.getFixedT('en-US');
            let userDOC = await this.client.database.users.findOne(user.id);

            for (let type of user.types) {
                settings.push(this.keys[type]);
                await this.client.database.users.update(user.id, {
                    [`votes.${type}.active`]: false
                })
            }

            userDOC = await this.client.database.users.findOne(user.id);
            if (!userDOC.votes['BPD'].active && !userDOC.votes['DBL'].active) await this.client.database.users.update(user.id
                , {
                    'vip.active': false,
                    premiumUtils: {
                        textcolor: '#000000',
                        fontFamily: 'Arial'
                    }
                }
            );

            const msg = settings.length > 1 ? 'clientMessages:vip.vipUnSetMultiple' : 'clientMessages:vip.vipUnSet';
            return this.send(true, {
                method: 'unvip',
                settings,
                user: await this.client.fetchUser(user.id),
                msg,
                send: userDOC.vip.notifier,
                t
            })
        })

        return this.client.database.clientUtils.update(this.client.user.id, { $set: { 'removeVotes': [] } });
    }
}