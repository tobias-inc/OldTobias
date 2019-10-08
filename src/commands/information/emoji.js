const {
    Discord = require("discord.js"),
    Attachment = Discord.Attachment,
    Command, Emojis, ClientEmbed
} = require("../../");

class Emoji extends Command {
    constructor(client) {
        super(client, {
            name: "emoji",
            description: "Transforma um emoji em imagem",
            usage: { args: true, argsNeed: true, argsTxt: "<emoji [link,ID]> ", need: "{prefix} {cmd} {args}", },
            category: "Information",
            cooldownTime: 3000,
            aliases: ["Aumentar", "Large"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
        });
    }

    async run({ channel, guild, author, args }, t, { displayAvatarURL } = this.client.user) {

        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL);

        if (!args) {
            return channel.send(EMBED
                .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:emojiinfo.noArgs'))
                .setColor(process.env.ERROR_COLOR)
            )
        }

        let emojo = false

        emojo = await this.GetEmoji(args[0], guild);

        if (!emojo) {
            return channel.send(EMBED
                .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:emojiinfo.noEmoji', { searsh: args[0] }))
                .setColor(process.env.ERROR_COLOR)
            )
        }
        let type = emojo.animated ? '.gif' : '.png'
        let emoji = new Attachment(emojo.url, emojo.name + type);
        channel.send(`\`${emojo.name}\``, emoji)  
    }
}

module.exports = Emoji;