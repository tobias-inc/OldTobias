const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../..");

class Transfer extends Command {
    constructor(client) {
        super(client, {
            name: "transfer",
            description: "Transfere seus Biscoitos Tobias para o banco.",
            usage: { args: false, argsNeed: false },
            category: "Economy",
            cooldownTime: 86400000,
            aliases: ["transferir", "transferencia", "tr", "bank", "banco"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, message, author }, t, { displayAvatarURL } = this.client.user) {
        const embed = new ClientEmbed(author).setAuthor(this.client.user.username, displayAvatarURL)

        let user = await this.client.database.users.findOne(message.author.id)
        let coins = user.coins
        if (coins = 0) return channel.send("Sem money no bolso");
        await this.client.DatabaseUtils.transfer(user, coins)

        return channel.send(embed
            .setDescription(Emojis.Certo + t("clientMessages:transfer", { money: coins }))
            .setColor(process.env.COLOR_EMBED)
        ).then(await this.client.DatabaseUtils.daily(user, 0));
    }
}
module.exports = Transfer;