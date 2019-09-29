const {
    Util = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Reset extends Command {
    constructor(client) {
        super(client, {
            name: "reset",
            description: "Reseta a queue",
            usage: { args: true, argsNeed: true, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 3000,
            aliases: ["Resetar"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj:false,
        });
    }

    async run({channel, guild, author, voiceChannel}, t) {
        const trueResult = await this.verifyVoice(t,guild, channel, author, voiceChannel);
        if (trueResult) {
            const embed = new ClientEmbed(author);
            const guildQueue = await this.client.music.module.queue.get(guild.id);
            if (guildQueue && guildQueue.songPlaying) {
                return channel.send(embed
                    .setTitle(t('clientMessages:Reset'))
                ).then(() => guildQueue.resetQueue())
            } else {
                return channel.send(embed
                    .setTitle(('clientMessages:Jump.noMusicat'))
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        }
    }
}
module.exports = Reset
