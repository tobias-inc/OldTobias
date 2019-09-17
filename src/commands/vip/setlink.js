const {
    Discord = require("discord.js"),
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../..");

class Link extends Command {
    constructor(client) {
        super(client, {
            name: "setlink",
            description: "Adiciona um link ao seu perfil",
            usage: { args: true, argsNeed: true, argsTxt: "<emoji [id, name]> [option]", need: "{prefix} {cmd} {args}", },
            category: "Vip",
            cooldown: 3000,
            aliases: [],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            vipUser: true
        });
    }

    async run({ channel, message, author, args }, t ,{ displayAvatarURL } = this.client.user) {

        const USER = message.author
        const EMBED = new ClientEmbed(author)
        if(!args)return channel.send(t("errors:noLink"))
        const link = args[1]
        .setAuthor(this.client.user.username, displayAvatarURL)

            let user = await this.client.database.users.get(USER.id);
            await this.client.DatabaseUtils.setLink(user, link)
                return channel.send(EMBED
                    .setDescription(Emojis.Certo + t("clientMessages:SetLink.description", {user:USER.username}))
                    .addField(t("clientMessages:SetLink.field",{ user:USER.username}),user.redirect)
                    .setColor(process.env.COLOR_EMBED)
        )
    }
}
module.exports = Link;