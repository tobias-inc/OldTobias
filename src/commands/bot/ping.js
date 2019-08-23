const { Command, Emojis, ClientEmbed } = require("../../");

class Ping extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Tempo de resposta do bot",
            usage: { args: true, argsNeed: false },
            category: "Bot",
            cooldown: 3000,
            aliases: ["p","P"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({channel,author},t) {
        const parse = await this.getPing();
        const EMBED = new ClientEmbed(author)
        return channel.send(EMBED
            .setDescription(t("comandos:Ping", { Ping:parse.replace("MS","ms")}))
            .setColor(process.env.COLOR_EMBED)
        )
    }
}

module.exports = Ping;