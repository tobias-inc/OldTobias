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
        let emojo = message.attachments.first().url

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
                .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:addemoji.noImage'))
                .setColor(process.env.ERROR_COLOR)
            )
          }
         if (!emojo) {
            return channel.send(EMBED
                .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:addemoji.noImage'))
                .setColor(process.env.ERROR_COLOR)
            )
        }
            guild.createEmoji(emojo, args[0])

        let type = message.attachments.animated ? '.gif' : '.png'
        let emoji = new Attachment( emojo, args[0] + type);
        channel.send(`\`${args[0]}\``, emoji)
    }
}

module.exports = addemoji;