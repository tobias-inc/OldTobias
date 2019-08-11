const {
    Discord = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Jump extends Command {
    constructor(client) {
        super(client, {
            name: "Jump",
            description: "Pula para uma determinada musica",
            usage: { args: true, argsNeed: true, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 3000,
            aliases: ["pular", "jm", "jumpto"],
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
                    let jump = Number(args[0]);
                    if (!(!isNaN(Number(args[0])))) return channel.send(embed
                        .setTitle(t("clientMessages:Jump.insertaNumber", { LEN: guildQueue.songs.length }))
                        .setColor(process.env.ERROR_COLOR)
                    );
                    jump = Math.round(jump);
                    if (jump > guildQueue.songs.length || jump < 1) return channel.send(embed
                        .setTitle(t("clientMessages:Jump.insertaNumberat", { LEN: guildQueue.songs.length }))
                        .setColor(process.env.ERROR_COLOR)
                    );
                    return message.react('⤴').then(() => guildQueue.jump(jump));
                } else {
                    return channel.send(embed
                        .setTitle(t("clientMessages:Jump.skipNumber", { LEN: guildQueue.songs.length }))
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
module.exports = Jump;