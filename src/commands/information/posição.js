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
Array.prototype.chunk = function(chunkSize) {
    var R = [];
    for (var i = 0; i < this.length; i += chunkSize)
      R.push(this.slice(i, i + chunkSize));
    return R;
};

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
        const body = await message.guild.fetchMembers().then(guild => {
            return guild.members.sort((a, b) => {
              return a.joinedTimestamp - b.joinedTimestamp
            }).map(x => x.user.username)
          })
          
        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL);

        let inPage = 1;
        let pages = body.chunk(10);

        channel.send(EMBED
            .setDescription(pages[inPage - 1])
            .setFooter(t('comandos:lyrics.footer', {
                page: 1,
                total: pages.length
            }), author.displayAvatarURL)
        ).then(async (msg) => {
            if (pages.length > 1) {
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
                        if ((inPage) == pages.length) {
                            inPage = 1;
                            msg.edit(EMBED.setDescription(pages[inPage - 1]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage ),
                                total:  pages.length
                            }), author.displayAvatarURL))
                        } else {
                            inPage += 1;
                            msg.edit(EMBED.setDescription(pages[inPage - 1]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage ),
                                total:  pages.length
                            }), author.displayAvatarURL))
                        }
                    } else if (r.emoji.id == Emojis.reactions.back) {
                        if ((inPage - 1) == pages.length && inPage - 1 < 0) {
                            inPage = 0;
                            msg.edit(EMBED.setDescription(pages[inPage - 1]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage ),
                                total:  pages.length
                            }), author.displayAvatarURL))
                        } else {
                            inPage -= 1;
                            msg.edit(EMBED.setDescription(pages[inPage - 1]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage ),
                                total:  pages.length
                            }), author.displayAvatarURL))
                        }

                    }
                })
            }
        })
    }
}
module.exports = Position;