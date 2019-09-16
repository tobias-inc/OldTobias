const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../..");

class Coins extends Command {
    constructor(client) {
        super(client, {
            name: "coins",
            description: "Mostra os créditos ",
            usage: { args: false, argsNeed: false},
            category: "Economy",
            cooldown: 3000,
            aliases: ["bal", "contra-cheque"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, message,author,args,guild }, t, { displayAvatarURL } = this.client.user) {

        const USER = (await this.GetUser(args, message, guild, author));
        const EMBED = new ClientEmbed(author)
        .setAuthor(this.client.user.username, displayAvatarURL)

            let user = await this.client.database.users.get(USER.id);

                return channel.send(EMBED
                    .setDescription(Emojis.Certo + t("clientMessages:Coins.description", {user:USER.username}))
                    .addField(t("clientMessages:Coins.field",{ user:USER.username}),user.coins)
                    .setColor(process.env.COLOR_EMBED)
        )  
    }
}
module.exports = Coins;