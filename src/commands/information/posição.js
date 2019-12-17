const {
    Discord = require("discord.js"),
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../../");

const msgTimeOut = async (msg, time) => {
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, time)
    })
    return msg.clearReactions().catch(() => { });
}

class Position extends Command {
    constructor(client) {
        super(client, {
            name: "position",
            description: "Informações sobre a posição dos primeiros members do server",
            usage: { args: true, argsNeed: true, argsTxt: "<emoji [id, name]>", need: "{prefix} {cmd} {args}", },
            category: "Information",
            cooldownTime: 3000,
            aliases: ["pos", "primeiros"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
        });
    }

    async run({ channel, author, message }, t) {
        const body = message.guild.members.sort((a, b) => { return new Date(a.joinedAt) - new Date(b.joinedAt); }).map(x => x.user.username)
        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL);
        let inPage = 0;

        channel.send(EMBED
            .setDescription(body[0])
            .setFooter(t('comandos:lyrics.footer', {
                page: 1,
                total: body.length
            }), author.displayAvatarURL)
        ).then(async (msg) => {
            if (body.length > 1) {
                await msg.react(Emojis.reactions.back)
                await msg.react(Emojis.reactions.next);
                const initializeCollector = (msg.createReactionCollector(
                    (reaction, user) => [Emojis.reactions.next, Emojis.reactions.back].includes(reaction.emoji.id)
                        && user.id === author.id,
                    { time: 120000 })
                );
                msgTimeOut(msg, 120000);
                return initializeCollector.on('collect', async (r) => {
                    await r.remove(author.id).catch(() => { });
                    if (r.emoji.id == Emojis.reactions.next) {
                        if ((inPage + 1) == body.length) {
                            inPage = 0;
                            msg.edit(EMBED.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        } else {
                            inPage += 1;
                            msg.edit(EMBED.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        }
                    } else if (r.emoji.id == Emojis.reactions.back) {
                        if ((inPage - 1) == body.length) {
                            inPage = 0;
                            msg.edit(EMBED.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        } else {
                            inPage -= 1;
                            msg.edit(EMBED.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        }
                    }
                })
            }
        })
    }
}
module.exports = Position;