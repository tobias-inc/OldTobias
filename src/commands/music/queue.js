const {
    Util = require('discord.js'),
    Command, ClientEmbed,Emojis
} = require("../..");

class Queue extends Command {
    constructor(client) {
        super(client, {
            name: "queue",
            description: "Mostra a lista de musicas",
            usage: { args: true, argsNeed: true, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldownTime: 3000,
            aliases: ["Playlist", "List", "Lista"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj: false,
        });
    }

    async run({ channel, guild, author }, t) {
        const embed = new ClientEmbed(author);
        const guildQueue = await this.client.music.module.queue.get(guild.id);
        if (guildQueue && guildQueue.songPlaying) {
            return channel.send(embed
                .setTitle(t('clientMessages:Queue.title'),{NAME:guild.name})
                .setDescription(
                    [`🎵 ${t('clientMessages:Queue.time')}**\[${guildQueue.queueFullDuration}]\`**`,
                    `${Emojis.Loading} Loop: **\`${guildQueue.loop ?  t('clientMessages:Loop.active') : t('clientMessages:Loop.inactive')}\`**`,
                    `▶ Atual: **\`[${guildQueue.nowDuration}/${guildQueue.songPlaying.durationContent}]\`** - **[${guildQueue.songPlaying.name}](${guildQueue.songPlaying.url})**`,
                    '\n🎶' + t('clientMessages:Queue.songlist') + (!guildQueue.songs.length
                        ? t('clientMessages:Jump.noMusic')
                        : guildQueue.songs.length <= 10
                            ? guildQueue.songs.map((s, n) => `\`${n + 1}.\` **[${s.name}](${s.url})**,` + t('clientMessages:Queue.by') + `**${s.addedBy.toString()}**.`).join('\n')
                            : guildQueue.songs.map((s, n) => `\`${n + 1}.\` **[${s.name}](${s.url})**, ` + t('clientMessages:Queue.by') + `**${s.addedBy.toString()}**.`).slice(0, 10).join('\n')
                            + t('clientMessages:Queue.more',{LEN:guildQueue.songs.length - 10})
                    )].join('\n')
                )
            )
        } else {
            return channel.send(embed
                .setTitle(t('clientMessages:Jump.noMusicat'))
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}
module.exports = Queue;