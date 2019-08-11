const { Command } = require("../../");

class Ping extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Tempo de resposta do bot",
            usage: { args: true, argsNeed: false },
            category: "Bot",
            cooldown: 3000,
            aliases: [],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ message, channel }) {
        const parse = await this.getPing();
        return channel.send(parse.replace(' MS', 'ms'));
    }
}

module.exports = Ping;