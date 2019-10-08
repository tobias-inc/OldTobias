const {
    Discord = require('discord.js'),
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../..");

class Kick extends Command {
    constructor(client) {
        super(client, {
            name: "kick",
            description: "Chuta um membro",
            usage: { args: true, argsNeed: true, argsTxt: "<User [id, mention, name]>", need: "{prefix} {cmd} {args}" },
            category: "Moderation",
            cooldown: 3000,
            aliases: ["kickar", "Chutar"],
            Permissions: ["KICK_MEMBERS"],
            UserPermissions: ["KICK_MEMBERS"],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args, language }, t, { displayAvatarURL } = this.client.user) {
        const USER = (await this.GetUser(args, message, guild));
        const REASON = args.slice(1).join(" ")
        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)
            .setThumbnail(guild.iconURL ? guild.iconURL : displayAvatarURL);

        if (!USER) {
            return channel.send(`${Emojis.Errado} | ` + t('comandos:ban.noUser'));
        }
        if(message.member.highestRole.comparePositionTo(guild.member(USER).highestRole) < 0) {
            channel.send(t(`comandos:Kick.Error`, { USER: USER }));
            return
        }
        if ( message.guild.members.get(this.client.user.id).highestRole.comparePositionTo(guild.member(USER).highestRole) <= 0) {
            channel.send(t(`comandos:Kick.Error1`, { USER: USER }));
            return
        }
        channel.send(`${Emojis.Popcorn} | ` + t('clientMessages:Kick.initialmessage', { USER: USER, REACTION:Emojis.reactions.okay}))
            .then(async (msg) => {
                await msg.react(Emojis.reactions.okay)
                await msg.react(Emojis.reactions.error)
                const filter = (reaction, user) => [Emojis.reactions.okay, Emojis.reactions.error].includes(reaction.emoji.id) && user.id === message.author.id
                const collector = msg.createReactionCollector(filter)
                collector.on("collect", r => {

                    switch (r.emoji.id) {
                        case Emojis.reactions.okay:

                            moment.locale(language)

                            message.guild.Kick(USER).catch(e => (t(`comandos:kick.Error`, { USER: USER }))).then(

                                channel.send(EMBED
                                    .setDescription(`${Emojis.Puto} | ` + t('clientMessages:Kick.description', { USER: USER, REACTION: Emojis.Certo }))
                                    .addField(`${Emojis.Love} |` + t('clientMessages:Kick.kickAuthor'), message.author.username)
                                    .addField(`${Emojis.Risada} | ` + t('clientMessages:Kick.punishment'), "Kick")
                                    .addField(`${Emojis.Popcorn} | ` + t('clientMessages:Kick.punished'), USER.username)
                                    .addField(`${Emojis.Ehmolekkk} | ` + t('clientMessages:Kick.reason'), REASON || t('clientMessages:Kick.noReason'))
                                    .setColor(process.env.COLOR_EMBED)
                                )
                            )
                            break;
                        case Emojis.reactions.error:
                            msg.delete().then(channel.send(t(`comandos:kick.lucky`, { USER: USER, AUTHOR: message.author })));
                            break;
                    }
                });
            });
    }
}
module.exports = Kick;