const {
    Discord = require('discord.js'),
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../..");

class Ban extends Command {
    constructor(client) {
        super(client, {
            name: "Ban",
            description: "Bane um membro",
            usage: { args: true, argsNeed: true, argsTxt: "<User [id, mention, name]>", need: "{prefix} {cmd} {args}" },
            category: "Moderation",
            cooldown: 3000,
            aliases: ["banir", "bane"],
            Permissions: ["BAN_MEMBERS"],
            UserPermissions: ["BAN_MEMBERS"],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args, language }, t, { displayAvatarURL } = this.client.user) {
        const USER = (await this.GetUser(args, message, guild, true));
        const REASON = args.slice(1).join(" ")

        if (message.member.highestRole.comparePositionTo(guild.member(USER).highestRole) < 0) {
            channel.send(t(`comandos:ban.Error`, { USER: USER }));
            return
        }

        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)
            .setThumbnail(guild.iconURL ? guild.iconURL : displayAvatarURL);

        if (!USER) {
            return channel.send(`${Emojis.Errado} | ` + t('comandos:ban.noUser'));
        }
        if (USER === true) {
            return channel.send(`${Emojis.Errado} | ` + t('comandos:ban.noUser'));
        }

        channel.send(`${Emojis.Popcorn} | ` + t('clientMessages:ban.initialmessage', { USER: USER }))
            .then(async (msg) => {
                await msg.react(Emojis.reactions.okay)
                await msg.react(Emojis.reactions.error)
                const filter = (reaction, user) => [Emojis.reactions.okay, Emojis.reactions.error].includes(reaction.emoji.id) && user.id === message.author.id
                const collector = msg.createReactionCollector(filter)
                collector.on("collect", r => {

                    switch (r.emoji.id) {
                        case Emojis.reactions.okay:

                            moment.locale(language)

                            message.guild.member(USER).ban(REASON).catch(e => (t(`comandos:ban.Error`, { USER: USER }))).then(

                                channel.send(EMBED
                                    .setDescription(`${Emojis.Puto} | ` + t('clientMessages:ban.description', { USER: USER, REACTION: Emojis.Certo }))
                                    .addField(`${Emojis.Love} |` + t('clientMessages:ban.banauthor'), message.author.username)
                                    .addField(`${Emojis.Risada} | ` + t('clientMessages:ban.punishment'), "Ban")
                                    .addField(`${Emojis.Popcorn} | ` + t('clientMessages:ban.punished'), USER.username)
                                    .addField(`${Emojis.Ehmolekkk} | ` + t('clientMessages:ban.reason'), REASON || t('clientMessages:ban.noReason'))
                                    .setColor(process.env.COLOR_EMBED)
                                )
                            )
                            break;
                        case Emojis.reactions.error:
                            msg.delete().then(channel.send(t(`comandos:ban.lucky`, { USER: USER, AUTHOR: message.author })));
                            break;
                    }
                });
            });
    }
}
module.exports = Ban;
