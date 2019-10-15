const {
    Util = require('discord.js'),
    Command, ClientEmbed,Emojis
} = require("../..");

class Skip extends Command {
    constructor(client) {
        super(client, {
            name: "skip",
            description: "Pula a musica atual",
            usage: { args: true, argsNeed: true, argsTxt: "<Music [name]>", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldownTime: 3000,
            aliases: ["pular","s"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
            roleDj:false,
        });
    }

    async run({ message, channel, guild, author, voiceChannel}, t) {
        const trueResult = await this.verifyVoice(t,guild, channel, author, voiceChannel);
        if (trueResult) {
            const embed = new ClientEmbed(author);
            const guildQueue = await this.client.music.module.queue.get(guild.id);
            const {song} = {
                song: guildQueue.songPlaying
            }
            if(message.author === song.addedBy){
                return message.react(Emojis.reactions.next).then(() => guildQueue.skip());
            } 
            if (guildQueue && guildQueue.songs.length) {
               return channel.send(embed
                    .setTitle(t('clientMessages:Skip'))
                ).then(msg =>{ msg.react(Emojis.reactions.next)
                    const filter = (reaction) => reaction.emoji.id === Emojis.reactions.next
                    msg.awaitReactions(filter, { time: 30000 })
                      .then(collected => collected.size >= voiceChannel.members.size)
                })
            }else {
                if (guildQueue) {
                    return channel.send(embed
                        .setTitle(t('errors:skip'))
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
module.exports = Skip;