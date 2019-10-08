const {
    Util = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Play extends Command {
    constructor(client) {
        super(client, {
            name: "play",
            description: "Toca uma musica",
            usage: { args: true, argsNeed: true, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldownTime: 3000,
            aliases: ["p", "Tocar"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj: false,
        });
    }

    async run({ args, channel, guild, author, voiceChannel},t) {
        const trueResult = await this.verifyVoice(t, guild, channel, author, voiceChannel, true);
        if (trueResult) {
            const paramUrl = /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
            const search = args.slice(0).join(' ');
            const embed = new ClientEmbed(author);

            if (search) {
                let result = false;
                if (search.match(paramUrl)) {
                    const url = args.find(m => m.match(paramUrl));
                    result = await this.client.music.utils.playUrl(url);
                } else {
                    result = await this.client.music.apis.youtube.getSongByTitle(Util.escapeMarkdown(search));
                }

                if (Array.isArray(result) && result.length) {
                    let queueBreak = this.client.music.module.queue.get(guild.id);
                    try {
                        this.client.music.module.play(result, guild, voiceChannel, channel, author);
                        let guildQueue = this.client.music.module.queue.get(guild.id);
                        if (!queueBreak) this.responseMusic(guildQueue, channel, t);
                    } catch (err) {
                        return channel.send(embed
                            .setTitle(t('errors:CommandError.description1'))
                            .setDescription(err.message)
                            .setColor(process.env.ERROR_COLOR)
                        )
                    }
                } else {
                    return channel.send(embed
                        .setTitle(t('errors:CommandError.description1'))
                        .setDescription(t('errors:play.notfound'))
                        .setColor(process.env.ERROR_COLOR)
                    )
                }
            } else {
                return channel.send(embed
                    .setTitle(t('errors:CommandError.description1'))
                    .setDescription(t('errors:play.noArgs'))
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        }
    }

    responseMusic(queue, channel, t) {
        const send = async (e) => channel.send(e);
        const embed = (u, d, c) => {
            const e = new ClientEmbed(u).setDescription(d);
            return c ? e.setColor(process.env.ERR_COLOR) : e;
        }

        queue.on('stop', (u, l) => l || send(embed(u, t('clientMessages:Play.stop'), true)))
        queue.on('start', (s) => send(embed(s.addedBy, t('clientMessages:Play.start', { song: `[${s.name}](${s.url})`, duration: `[${s.durationContent}]` }))).then((m) => queue.setLastMesage(m)));
        queue.on('errorSong', (s) => send(embed(s.addedBy, t('clientMessages:Play.errorsong', { song: `[${s.name}](${s.url})` }))))
        queue.on('queue', (s, u) => {
            if (s.length > 1) send(embed(u, t('clientMessages:Play.addmusics', { LEN: s.length })))
            else {
                send(embed(u, t('clientMessages:Play.addmusic', { song: `[${s[0].name}](${s[0].url})` }))).then(m => m.delete(20000));
            }
        })
    }
}

module.exports = Play;