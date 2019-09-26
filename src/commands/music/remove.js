const {
    Util = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Remove extends Command {
    constructor(client) {
        super(client, {
            name: "remove",
            description: "Remove uma musica",
            usage: { args: true, argsNeed: true, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 3000,
            aliases: ["Remover", "tirar"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj: false,
        });
    }

    async run({ args, channel, guild, author, voiceChannel }, t) {
        const trueResult = await this.verifyVoice(guild, t, channel, author, voiceChannel);
        if (trueResult) {
            const embed = new ClientEmbed(author);
            const guildQueue = await this.client.music.module.queue.get(guild.id);
            if (guildQueue && guildQueue.songs.length) {
                if (args[0]) {
                    let remove = Number(args[0]);
                    if (!(!isNaN(Number(args[0])))) return channel.send(embed
                        .setTitle(t('clientMessages:Remove.insertnumb', { LEN: guildQueue.songs.length }))
                        .setColor(process.env.ERROR_COLOR)
                    );
                    remove = Math.round(remove);
                    if (remove > guildQueue.songs.length || remove < 1) return channel.send(embed
                        .setTitle(t('clientMessages:Remove.insertnum'), { LEN: guildQueue.songs.length })
                        .setColor(process.env.ERROR_COLOR)
                    );
                    let song = guildQueue.songs[remove - 1];
                    return channel.send(embed
                        .setDescription(t('clientMessages:Remove.removed', { song: `[${song.name}](${song.url})` }))
                    ).then(() => guildQueue.removeOne(remove));
                } else {
                    return channel.send(embed
                        .setTitle(t('clientMessages:Remove.insertnumb', { LEN: guildQueue.songs.length }))
                        .setColor(process.env.ERROR_COLOR)
                    )
                }
            } else {
                if (guildQueue) {
                    return channel.send(embed
                        .setTitle(t('clientMessages:Jump.noMusic'))
                        .setColor(process.env.ERROR_COLOR)
                    )
                } else {
                    return channel.send(embed
                        .setTitle(t('clientMessages:Jump.noMusicat'))
                        .setColor(process.env.ERROR_COLOR)
                    )
                }
            }
        }
    }
}
module.exports = Remove;