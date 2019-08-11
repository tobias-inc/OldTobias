const { ClientEmbed, Command, Emojis } = require("../../");

const msgTimeOut = async (msg, time) => {
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, time)
    })
    return msg.clearReactions().catch(() => { });
}

class Lyrics extends Command {
    constructor(client) {
        super(client, {
            name: "lyrics",
            description: "Mostra a letra da música inserida",
            usage: { args: true, argsNeed: false, argsTxt: "<music name> [or music listen in spotify]", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 5000,
            aliases: ["lyr", "letra"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, author, args }, t) {
        const embed = new ClientEmbed(author);
        const search = args[0] ? args.join(' ')
            : author.presence.game
            && author.presence.game.name == 'Spotify'
            && `${author.presence.game.details} - ${author.presence.game.state.split(';')[0]}`
            || false;

        if (search) {
            const { hits: [hit] } = await this.client.apis.GeniusApi.findTrack(search);

            if (hit) {
                const { thumbnailUrl, title, artist, id, path } = hit;

                let inPage = 0;
                const body = this.splitLyric(await this.client.apis.GeniusApi.loadLyrics(id));

                (embed
                    .setTitle(`${title} - ${artist}`)
                    .setURL(`http://genius.com${path}`)
                    .setThumbnail(thumbnailUrl)
                    .setDescription(body[0])
                    .setFooter(t('comandos:lyrics.footer', {
                        page: 1,
                        total: body.length
                    }), author.displayAvatarURL)
                )

                return channel.send(embed).then(async (msg) => {
                    if (body.length > 1) {
                        await msg.react(Emojis.reactions.back)
                        await msg.react(Emojis.reactions.next);
                        const initializeCollector = (msg.createReactionCollector(
                            (reaction, user) => ["♻", Emojis.reactions.next, Emojis.reactions.back].includes(reaction.emoji.id)
                                && user.id === author.id,
                            { time: 120000 })
                        );

                        msgTimeOut(msg, 120000);
                        return initializeCollector.on('collect', async (r) => {
                            await r.remove(author.id).catch(() => { });
                            if (r.emoji.id == Emojis.reactions.next) {
                                if ((inPage + 1) == body.length) {
                                    inPage = 0;
                                    msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                        page: (inPage + 1),
                                        total: body.length
                                    }), author.displayAvatarURL))
                                } else {
                                    inPage += 1;
                                    msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                        page: (inPage + 1),
                                        total: body.length
                                    }), author.displayAvatarURL))
                                }
                            }else if (r.emoji.id == Emojis.reactions.back) {
                                if ((inPage - 1) == body.length) {
                                    inPage = 0;
                                    msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                        page: (inPage + 1),
                                        total: body.length
                                    }), author.displayAvatarURL))
                                } else {
                                    inPage -= 1;
                                    msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                        page: (inPage + 1),
                                        total: body.length
                                    }), author.displayAvatarURL))
                                }
                        } else if (r.emoji.name == '♻') {
                            inPage = 0;
                            msg.edit(embed.setDescription(body[inPage]).setFooter(t('comandos:lyrics.footer', {
                                page: (inPage + 1),
                                total: body.length
                            }), author.displayAvatarURL))
                        }

                            if (inPage == 0)
                                msg.reactions.get("♻")
                                    && msg.reactions.get("♻")
                                        .remove(msg.reactions.get("♻").users.last().id).catch(() => { });
                            else if (inPage == 1) msg.react("♻");
                        })
                    }
                })
            } else {
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:lyrics:noSong')}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:lyrics:noSong')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }

    splitLyric(str) {
        return str.match(/(.|[\r\n]){1,500}/g);
    }
}

module.exports = Lyrics;