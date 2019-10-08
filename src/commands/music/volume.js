const {
    Util = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Volume extends Command {
    constructor(client) {
        super(client, {
            name: "volume",
            description: "Seta o volume das musicas",
            usage: { args: true, argsNeed: true, argsTxt: "<Music [volume]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldownTime: 3000,
            aliases: ["Vol", "V"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj: false,
        });
    }

    async run({ args, channel, guild, author, voiceChannel }, t) {
        const trueResult =await this.verifyVoice(t, guild, channel, author, voiceChannel, false);
        const embed = new ClientEmbed(author);
        if (trueResult) {
            const guildQueue = await this.client.music.module.queue.get(guild.id);
            if (guildQueue && guildQueue.songPlaying) {
                if (args[0]) {
                    let vol = Number(args[0]);
                    if (!(!isNaN(Number(args[0])))) return channel.send(embed
                        .setTitle(t('clientMessages:Volume.insertnum'))
                        .setColor(process.env.ERROR_COLOR)
                    );
                    vol = Math.round(vol);
                    if (vol > 300 || vol < 0) return channel.send(embed
                        .setTitle(t('clientMessages:Volume.insertargs'))
                        .setColor(process.env.ERROR_COLOR)
                    );
                    return channel.send(embed
                        .setTitle(t('clientMessages:Volume.changed', { VOL: vol }))
                    ).then(() => guildQueue.volUpdate(vol));
                } else {
                    return channel.send(embed
                        .setTitle('clientMessages:Volume.insertargs')
                        .setColor(process.env.ERROR_COLOR)
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
}
module.exports = Volume;