const Infos = require("./VotesStructures.js");

module.exports = class VotesUtils extends Infos {
    constructor(client) {
        super(client);
        this.client = client
    }

    on() {
        const check = () => this.checkVotes();
        const checkVotes = () => setInterval(check, (3 * 60000));
        check();
        checkVotes();
    }

    async checkVotes() {
        const { voteds, removeVotes } = await this.client.database.clientUtils.findOne(this.client.user.id);

        if (voteds.length) {
            const parseType = [];
            for (const voted of voteds) {
                let { type, date, id } = voted;
                if (parseType.some(b => b.id == voted.id)) {
                    let parse = parseType.find(b => b.id == id)
                    parse.date[type] = date
                    parse.types.push(type);
                } else {
                    parseType.push({
                        id,
                        date: {
                            [type]: date
                        },
                        types: [type]
                    })
                }
            }

            parseType.forEach(async (user) => {
                const settings = [];
                const userDOC = await this.client.database.users.findOne(user.id);
                const t = this.client.language.i18next.getFixedT('en-US');

                for (let type of user.types) {
                    settings.push(this.keys[type]);
                    await this.client.database.users.update(user.id, {
                        [`votes.${type}`]: {
                            active: true,
                            date: user.date[type],
                            numVotes: userDOC.votes[type].numVotes + 1
                        }
                    })
                }

                const msg = settings.length > 1 ? 'clientMessages:vip.vipSetMultiple' : 'clientMessages:vip.vipSet';
                await this.client.database.users.update(user.id, { 'vip.active': true });
                return this.send(true, {
                    method: 'vip',
                    settings,
                    user: await this.client.fetchUser(user.id),
                    msg,
                    send: userDOC.vip.notifier,
                    t
                })
            })
        }

        if (removeVotes.length) this.removeVotes(removeVotes);
        if (voteds.length) return this.client.database.clientUtils.update(this.client.user.id, { $set: { 'voteds': [] } });
    }
}