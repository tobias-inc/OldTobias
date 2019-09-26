const Event = require("../../structures/Event.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class TobiasGuildEvent extends Event {
    constructor(client) {
        super(client)
        this.client = client
        this.name = 'TobiasGuild'
    }
    async ON(guildMemberAdd) {
        let guild = `${this.client.guilds.get('500452776770535444').memberCount}`.split("");
        const contador = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        let count = '';
        for (let i = 0; i < guild.length; i++) { count += ':' + contador[guild[i]] + ':'; }
        let canal = this.channels.get('538711394137407488');
        canal.setTopic(`Temos atualmente ${count-11} TobiasMunistas`);
    }
    async ON(guildMemberRemove) {
        let guild = this.client.guilds.get('500452776770535444').memberCount.split("");
        const contador = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        let count = '';
        for (let i = 0; i < guild.length; i++) { count += ':' + contador[guild[i]] + ':'; }
        let canal = this.channels.get('538711394137407488');
        canal.setTopic(`Temos atualmente ${count-11} TobiasMunistas`);
    }
}