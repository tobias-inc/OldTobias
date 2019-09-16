const {
    Discord = require('discord.js'),
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../..");

class Unban extends Command {
    constructor(client) {
        super(client, {
            name: "Unban",
            description: "Desbane um membro",
            usage: { args: true, argsNeed: true, argsTxt: "<User [id, mention, name]>", need: "{prefix} {cmd} {args}" },
            category: "Moderation",
            cooldown: 3000,
            aliases: ["desbanir", "disbane"],
            Permissions: ["BAN_MEMBERS"],
            UserPermissions: ["BAN_MEMBERS"],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ message, channel, guild, author, args, language }, t, { displayAvatarURL } = this.client.user, fetchBans) {
        const USER = (await this.GetUser(args, message, guild, true));
        const REASON = args.slice(1).join(" ")
        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)
            .setThumbnail(guild.iconURL ? guild.iconURL : displayAvatarURL);


        if (!USER) {
            return channel.send(`${Emojis.Errado} | ` + t('comandos:Unban.noUser'));
        }
        if (USER === true) {
            return channel.send(`${Emojis.Errado} | ` + t('comandos:Unban.noUser'));
        }
        if (!fetchBans.has(USER)) {
            return message.channel.send("Este usuario não esta banido.");
        }

        channel.send(`${Emojis.Popcorn} | ` + t('clientMessages:Unban.initialmessage', { USER: USER }))
            .then(async (msg) => {
                await msg.react(Emojis.reactions.okay)
                await msg.react(Emojis.reactions.error)
                const filter = (reaction, user) => [Emojis.reactions.okay, Emojis.reactions.error].includes(reaction.emoji.id) && user.id === message.author.id
                const collector = msg.createReactionCollector(filter)
                collector.on("collect", r => {

                    switch (r.emoji.id) {
                        case Emojis.reactions.okay:

                            moment.locale(language)

                            message.guild.unban(USER).catch(e => (t(`comandos:Unban.Error`, { USER: USER }))).then(

                                channel.send(EMBED
                                    .setDescription(`${Emojis.Puto} | ` + t('clientMessages:Unban.description', { USER: USER, REACTION: Emojis.Certo }))
                                    .addField(`${Emojis.Love} |` + t('clientMessages:Unban.unbanauthor'), message.author.username)
                                    .addField(`${Emojis.Risada} | ` + t('clientMessages:Unban.punishment'), "Unban")
                                    .addField(`${Emojis.Popcorn} | ` + t('clientMessages:Unban.punished'), USER.username)
                                    .addField(`${Emojis.Ehmolekkk} | ` + t('clientMessages:Unban.reason'), REASON || t('clientMessages:Unban.noReason'))
                                    .setColor(process.env.COLOR_EMBED)
                                )
                            )
                            break;
                        case Emojis.reactions.error:
                            msg.delete().then(channel.send(t(`comandos:Unban.badluck`, { USER: USER, AUTHOR: message.author })));
                            break;
                    }
                });
            });
    }
}
module.exports = Unban;