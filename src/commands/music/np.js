const {
    Discord = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class NowPlaying extends Command {
    constructor(client) {
        super(client, {
            name: "NowPlayng",
            description: "Mostra a musica que está sendo tocada",
            usage: { args: true, argsNeed: false, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 3000,
            aliases: ["np", "Tocandoagora", "Ta"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj: false,
        });
    }

    async run({ args, channel, guild, author }, t) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songPlaying) {
            const argsSong = args[0] && !isNaN(args[0]) && guildQueue.songs[(Number(args[0]) - 1)];
            const { song, footer, duration, timestamp } = {
                song: argsSong || guildQueue.songPlaying,
                footer: argsSong
                    ? t('clientMessages:Np.playingNow',{NAME:guildQueue.songPlaying.name})
                    : author.username,
                duration: argsSong ? false : true,
                timestamp: argsSong ? false : true
            }
            const songDuration = this.getDuration(song, guildQueue, duration);
            return channel.send(new ClientEmbed(author, timestamp)
                .setDescription(`**[${song.name}](${song.url})**`)
                .addField(t('clientMessages:Np.addedby'), song.addedBy.toString(), false)
                .addField(t('clientMessages:Np.duration'), songDuration, true)
                .addField(t('clientMessages:Np.position'), argsSong ? `**\`${(guildQueue.songs.indexOf(argsSong) + 1)}°\`**` : t('clientMessages:Np.playngnow'), true)
                .setImage(song.thumbnail.url)
            )
        } else {
            return channel.send(embed
                .setTitle(t('clientMessages:Jump.noMusicat'))
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }

    getDuration(s, q, d) {
        return d ? `**\`[${q.nowDuration}/${s.durationContent}]\`**` : `**\`[${s.durationContent}]\`**`;
    }
}
module.exports = NowPlaying;