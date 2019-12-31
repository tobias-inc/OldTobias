const {
    Discord = require("discord.js"),
    Attachment = Discord.Attachment,
    Command, Emojis, ClientEmbed
} = require("../../");

class addemoji extends Command {
    constructor(client) {
        super(client, {
            name: "addemoji",
            description: "Adiciona um emoji em uma guild",
            usage: { args: true, argsNeed: true, argsTxt: "<emoji [link,ID]> ", need: "{prefix} {cmd} {args}", },
            category: "Information",
            cooldownTime: 3000,
            aliases: ["adde", "aemo"],
            Permissions: ["MANAGE_EMOJIS"],
            UserPermissions: ["MANAGE_EMOJIS"],
            devNeed: false,
            needGuild: true,
        });
    }

    async run({ channel, guild, author,message, args }, t, { displayAvatarURL } = this.client.user) {
        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL);

        if (!args) {
            return channel.send(EMBED
                .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:addemoji.noArgs'))
                .setColor(process.env.ERROR_COLOR)
            )
        }
          if(!message.attachments) {
            return channel.send(EMBED
                .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:addemoji.noEmoji'))
                .setColor(process.env.ERROR_COLOR)
            )
          }

         let emojo = message.attachments.map(a =>a.url)
            guild.createEmoji(emojo, args[1])

        let type = message.attachments.animated ? '.gif' : '.png'
        let emoji = new Attachment(emojo, args[1] + type);
        channel.send(`\`${args[1]}\``, emoji)
    }
}

module.exports = addemoji;