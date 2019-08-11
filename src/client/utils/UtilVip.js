module.exports = class UtilVip {
    constructor(client) {
        this.client = client
    }

    bpdResult(votes) {
        if (votes.length) {
            return this.client.database.clientUtils.upsert(process.env.CLIENT_ID).then((doc) => {
                for (let vote of votes) {
                    if (doc.voteds.find(b => b.id == vote.id && b.type == vote.type)) break;
                    else {
                        doc.voteds.push(vote);
                    }
                }
                doc.save();
            })
        }
        else { }
    }

    async removeVip() {
        const keys = ['BPD', 'DBL'];
        const removeVips = [];
        const clientDoc = await this.client.database.clientUtils.findOne(process.env.CLIENT_ID);
        const docs = await this.client.database.users.findAll();
        const vipActive = [];

        await Promise.all(docs.map(doc => {
            for (let key of keys) {
                if (doc.votes[key].active) {
                    if (!vipActive.some(v => v._id == doc._id)) vipActive.push(doc);
                }
            }
        }));

        for (let vip of vipActive) {
            for (let key of keys) {
                const parseTIME = this.keys[key].vipHours.ms;
                const vipInKey = vip.votes[key];
                if (vipInKey.active && (Date.now() - vipInKey.date) >= parseTIME) {
                    if (!removeVips.some(b => b.id == vip._id && b.type == key)) {
                        clientDoc.removeVotes.some(r => r.id == vip._id && r.type == key) || removeVips.push({
                            id: vip._id,
                            type: key
                        })
                    }
                }
            }
        }

        if (removeVips.length) return this.client.database.clientUtils.upsert(process.env.CLIENT_ID).then((doc) => {
            doc.removeVotes = doc.removeVotes.concat(removeVips);
            doc.save();
        });
        return true;
    }

    async hasVoted(id, key, votes = 1) {
        const user = await this.client.fetchUser(id);
        if (!user || user.bot) throw new Error('No user!');

        const msParseInDatabase = await this.client.database.users.get(id).then(u => u.votes[key].date);
        const parseTime = this.keys[key].vipHours;

        switch (key) {
            case 'BPD':
                let hoursParse = Number(((Date.now() - msParseInDatabase) / 3600000).toFixed(0));
                if (hoursParse >= (8 * votes)) {
                    if (votes == 1
                        && hoursParse >= parseTime.h
                        && (new Date() - msParseInDatabase) >= 86400000
                    ) return false;
                    else if (votes > 1 && hoursParse >= (parseTime.h * votes)) return false;
                    else return true;
                }
                else return true;
            default: throw new Error('No key identify!');
        }
    }
}