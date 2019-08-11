const {
    Util = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Stop extends Command {
    constructor(client) {
        super(client, {
            name: "Stop",
            description: "Para completamente uma musica",
            usage: { args: true, argsNeed: false, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 3000,
            aliases: ["Pause", "parar"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj:false,
        });
    }

    async run({ channel, guild, author, voiceChannel}, t) {
        const trueResult = await this.verifyVoice(guild, t, channel, author, voiceChannel);
        if (trueResult) {
            const embed = new ClientEmbed(author);
            const guildQueue = await this.client.music.module.queue.get(guild.id);
            if (guildQueue && guildQueue.songPlaying) {
                return channel.send(embed
                    .setTitle(t('clientMessages:Stop'))
                ).then(() => guildQueue.stop() && voiceChannel.leave())
            } else {
                return channel.send(embed
                    .setTitle(t('clientMessages:Jump.noMusicat'))
                    .setColor(process.env.ERROR_COLOR)
                ).then(voiceChannel.leave())
            }
        }
    }
}
module.exports = Stop;
//sortuso@gmail.com:160488so
//nikkielizabeth115@gmail.com:merlyn11