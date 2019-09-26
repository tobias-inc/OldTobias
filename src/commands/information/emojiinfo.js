const {
    Discord = require("discord.js"),
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../../");

class EmojiInfo extends Command {
    constructor(client) {
        super(client, {
            name: "emojiinfo",
            description: "Informações sobre um emoji",
            usage: { args: true, argsNeed: true, argsTxt: "<emoji [id, name]>", need: "{prefix} {cmd} {args}", },
            category: "Information",
            cooldown: 3000,
            aliases: ["emojii", "ei"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
        });
    }

    async run({ channel, guild, author, args,language }, t ,{ displayAvatarURL } = this.client.user) {

           let EMOJI = await this.GetEmoji(args[0], guild);
    
            const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL);

            if(!args){
            return channel.send(EMBED
                .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:emojiinfo.noArgs'))
                .setColor(process.env.ERROR_COLOR)
            )
        }
        if(!EMOJI){
            return channel.send(EMBED
                .setDescription(Emojis.Errado + "**" + author.username + "**" + t('comandos:emojiinfo.noEmoji'))
                .setColor(process.env.ERROR_COLOR)
            )
        }
                    moment.locale(language);
                    return channel.send(EMBED
                        .setAuthor(this.client.user.username, displayAvatarURL)
                        .setThumbnail(EMOJI.url)
                        .addField(t('clientMessages:emojiinfo.name'), EMOJI.name, true)
                        .addField(t('clientMessages:emojiinfo.animated.ctx'), t(`clientMessages:emojiinfo.animated.${EMOJI.animated}`), true)
                        .addField(t('clientMessages:emojiinfo.id'), EMOJI.id, false)
                        .addField(t('clientMessages:emojiinfo.identifier'), EMOJI.identifier, false)
                        .addField(t('clientMessages:emojiinfo.createdAt'), moment(EMOJI.createdAt).format('LLLL'), false)
                        .addField(t('clientMessages:emojiinfo.link.ctx'), t('clientMessages:emojiinfo.link.Clickhere', {Link: EMOJI.id}),true)
            )     
        }
    }
module.exports = EmojiInfo;