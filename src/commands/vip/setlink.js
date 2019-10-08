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
            usage: { args: true, argsNeed: true, argsTxt: "<link>", need: "{prefix} {cmd} {args}", },
            category: "Vip",
            cooldownTime: 3000,
            aliases: ["link","linkar"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            vipUser: true
        });
    }

    async run({ channel, message, author, args }, t ,{ displayAvatarURL } = this.client.user) {

        let reg = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/ig
        if(!reg.test(message.content)) return channel.send(t("errors:noLink"))

        const link = args[1]
        const USER = message.author
        const user = await this.client.database.users.get(USER.id);

        const EMBED = new ClientEmbed(author)
        .setAuthor(this.client.user.username, displayAvatarURL)

            await this.client.DatabaseUtils.setLink(user, link)
        
                return channel.send(EMBED
                    .setDescription(Emojis.Certo + t("clientMessages:SetLink.description", {user:USER.username}))
                    .addField(t("clientMessages:SetLink.field") ,user.contributor.redirect)
                    .setColor(process.env.COLOR_EMBED)
        )
    }
}
module.exports = Link;