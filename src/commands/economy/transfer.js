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
       
        if (coins = 0) return channel.send("Sem money no bolso");

        this.client.DatabaseUtils.transfer(author, user.coins)
        await this.client.DatabaseUtils.daily(author, 0);

        return channel.send(embed
            .setDescription(Emojis.Certo + t("clientMessages:transfer", { money: user.bank }))
            .setColor(process.env.COLOR_EMBED)
        )
    }
}
module.exports = Transfer;