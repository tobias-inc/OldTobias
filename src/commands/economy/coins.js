const { Command, Emojis, ClientEmbed } = require("../..");

class Coins extends Command {
    constructor(client) {
        super(client, {
            name: "coins",
            description: "Mostra a quantidade de Biscoitos Tobias que você tem",
            usage: { args: false, argsNeed: false },
            category: "Economy",
            cooldownTime: 3000,
            aliases: ["bal", "contra-cheque", "balance", "balança"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, message, author, args, guild }, t, { displayAvatarURL } = this.client.user) {
        const USER = await this.GetUser(args, message, guild, author);
        const EMBED = new ClientEmbed(author).setAuthor(this.client.user.username, displayAvatarURL)
        const user = await this.client.database.users.get(USER.id);

        return channel.send(EMBED
            .setDescription(Emojis.Certo + t("clientMessages:Coins.description", { user: USER.username }))
            .addField(t("clientMessages:Coins.title", { user: USER.username }), t("clientMessages:Coins.field", { Money: user.bank, money: user.coins }))
        )
    }
}
module.exports = Coins;