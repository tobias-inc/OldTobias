const {
    Discord = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Clear extends Command {
    constructor(client) {
        super(client, {
            name: "clear",
            description: "limpa a queue",
            usage: { args: true, argsNeed: false, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 3000,
            aliases: ["limpo", "limpar"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj: true,
        });
    }

    async run({ channel, guild, author, voiceChannel }, t) {
        const trueResult = await this.verifyVoice(guild, t, channel, author, voiceChannel);
        if (trueResult) {
            const embed = new ClientEmbed(author);
            const guildQueue = await this.client.music.module.queue.get(guild.id);
            if (guildQueue && guildQueue.songs.length) {
                return channel.send(embed
                    .setTitle(t('clientMessages:Clear.clearedqueue'))
                ).then(() => guildQueue.clearQueue());
            } else {
                if (guildQueue) {
                    console.log()
                    return channel.send(embed
                        .setTitle(t('clientMessages:Clear.nomoremusic'))
                        .setColor(process.env.ERROR_COLOR)
                    )
                } else {
                    console.log()
                    return channel.send(embed
                        .setTitle(t('clientMessages:Clear.noPlaying'))
                        .setColor(process.env.ERROR_COLOR)
                    )
                }
            }
        }
    }
}
module.exports = Clear;