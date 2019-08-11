const UtilVip = require("../utils/UtilVip.js");
const fetch = require("node-fetch");

module.exports = class VipEvent extends UtilVip {
    constructor(client) {
        super(client);
        this.client = client;
        this.events = ["vipEvent"];
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
        };
    }

    onVipEvent() {
        this.listeningWebhook();
        const openDBpd = async () => {
            await this.listeningBpd().catch(() => { });
            this.removeVip().catch(() => { });
        };
        const bpdL = () => setInterval(openDBpd, (60000 * 2));
        openDBpd();
        bpdL();
    }

    async listeningBpd() {
        const votes = [];
        const BPD_VOTES = await fetch(`${this.keys['BPD'].api}/${process.env.CLIENT_ID}/votos`, {
            method: 'GET',
            headers: { Authorization: process.env.BPD_TOKEN }
        }).then((res) => res.json().then(({ votes }) => votes));

        if (BPD_VOTES.length) {
            for (const voted of BPD_VOTES) {
                if (BPD_VOTES.filter((id) => id == voted).length > 1) {
                    const hasVoted = await this.hasVoted(voted, 'BPD', BPD_VOTES.filter((id) => id == voted).length);
                    if (!hasVoted) {
                        if (!votes.some(b => b.id == voted)) votes.push({
                            id: voted,
                            type: 'BPD',
                            date: Date.now()
                        })
                    }
                } else {
                    const hasVoted = await this.hasVoted(voted, 'BPD');
                    if (!hasVoted) votes.push({
                        id: voted,
                        type: 'BPD',
                        date: Date.now()
                    });
                }
            }
            this.bpdResult(votes);
        }
        return true;
    }

    listeningWebhook() {
        return this.client.dbl.webhook.on("vote", (userVoted) => {
            this.client.database.clientUtils.upsert(process.env.CLIENT_ID).then((doc) => {
                doc.voteds.push({
                    id: userVoted.user,
                    type: 'DBL',
                    date: Date.now()
                });
                doc.save();
            })
        })
    }
}