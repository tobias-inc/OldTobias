const {
    Discord = require("discord.js"),
    Attachment = Discord.Attachment,
    Command, Emojis, ClientEmbed
} = require("../../");


const msgTimeOut = async (msg, time) => {
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, time)
    })
    return msg.clearReactions().catch(() => { });
}

class Emojiss extends Command {
    constructor(client) {
        super(client, {
            name: "emojis",
            description: "Mostra todos emojis de um servidor",
            usage: { args: false, argsNeed: false },
            category: "Information",
            cooldown: 3000,
            aliases: ["elist", "emojilist", "listadeemojis"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
        });
    }

    async run({ channel, message, author}, t) {
        const embed = new ClientEmbed(author)
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
            .setThumbnail(message.guild.iconURL);

        let emojis = message.guild.emojis.map(e => e)
        if (emojis.length == 0) return channel.send(t("errors:emojis")+ Emojis.Ehmolekkk)

        const body = this.splitEmojis(await message.guild.emojis.map(e => e))
            (embed
                .setDescription(body)
                .setFooter(t('comandos:emojis', {
                    page: 1,
                    total: body.length
                }), author.displayAvatarURL)
            )

        return channel.send(embed).then(async (msg) => {
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
                            msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:emojis', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        } else {
                            inPage += 1;
                            msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:emojis', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        }
                    } else if (r.emoji.id == Emojis.reactions.back) {
                        if ((inPage - 1) == body.length) {
                            inPage = 0;
                            msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:emojis', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        } else {
                            inPage -= 1;
                            msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:emojis', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        }
                    }
                })
            }
        })
    }
    splitEmojis(str) {
        return str.match(/(.|[\r\n]){1,500}/g);
    }
}
module.exports = Emojiss;