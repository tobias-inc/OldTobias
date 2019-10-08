const moment = require("moment")

moment.locale('pt-BR');

const getSong = (args, queue) => {
    args = Array.isArray(args) ? args.join(' ') : args;
    let type = 'name';
    let songs = queue.songs.concat([queue.songPlaying]);
    if (!isNaN(args)) type = 'number'
    else type = 'name';
    switch (type) {
        case 'name': {
            return songs.find(({ name }) => (name.toLowerCase() == args.toLowerCase()
                || name.toLowerCase().includes(args.toLowerCase()))
            )
        }
        case 'number': {
            return songs[(Number(args) - 1)]
        }
    }
}

const {
    Util = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Search extends Command {
    constructor(client) {
        super(client, {
            name: "search",
            description: "Procura as informações de uma musica",
            usage: { args: true, argsNeed: true, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldownTime: 3000,
            aliases: ["Procurar", "achar", "find"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj:false,
        });
    }

    async run({ args, channel, guild, author}, t) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songPlaying) {
            if (args[0]) {
                const song = await getSong(args, guildQueue);
                if (song) {
                    return channel.send(embed
                        .addField(t('clientMessages:Search.name'), `[${song.name}](${song.url})`)
                        .addField(t('clientMessages:Search.addedby'), song.addedBy.toString(), true)
                        .addField(t('clientMessages:Search.position'), ([guildQueue.songPlaying].indexOf(song) != -1
                            ? t('clientMessages:Search.np')
                            : `**${(guildQueue.songs.indexOf(song) + 1)}°**`
                        ))
                        .addField(t('clientMessages:Search.channel'), `**${song.channelOwner}**`)
                        .addField(t('clientMessages:Search.published'), `**${moment(song.publishedAt).format('LLLL')}**`)
                        .setThumbnail(song.thumbnail.url)
                    )
                } else {
                    return channel.send(embed
                        .setTitle(t('errors:play.notfound'))
                    )
                }
            } else {
                return channel.send(embed
                    .setTitle(t('clientMessages:Search.noargs'))
                )
            }
        } else {
            return channel.send(embed
                .setTitle(t('clientMessages:Jump.noMusicat'))
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}
module.exports = Search;