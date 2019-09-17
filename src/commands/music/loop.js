const {
    Discord = require('discord.js'),
    Command, ClientEmbed
} = require("../..");

class Loop extends Command {
    constructor(client) {
        super(client, {
            name: "loop",
            description: "Repete a musica",
            usage: { args: true, argsNeed: false, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 3000,
            aliases: ["repetir"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj: false,
        });
    }

    async run({ channel, guild, author, voiceChannel }, t) {
        const trueResult = await this.verifyVoice(guild, t, channel, author, voiceChannel);
        if (trueResult) {
            const embed = new ClientEmbed(author);
            const guildQueue = await this.client.music.module.queue.get(guild.id);
            if (guildQueue) {
                let loopActive = guildQueue.loop ? false : true;
                return channel.send(embed
                    .setTitle(loopActive ? t('clientMessages:Loop.active') : t('clientMessages:Loop.inactive'))
                ).then(() => guildQueue.queueLoop(loopActive))
            } else {
                return channel.send(embed
                    .setTitle(t('clientMessages:jump.noMusicat'))
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        }
    }
}
module.exports = Loop;