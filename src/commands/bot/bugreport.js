const {
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../../");

class BugReport extends Command {
    constructor(client) {
        super(client, {
            name: "bugreport",
            description: "Reporta um mal acontecimento ocorrido no uso de alguma função",
            usage: { args: false, argsNeed: false },
            category: "Bot",
            cooldownTime: 3000,
            aliases: ["reportbug", "bug"],
            Permissions: ["ADD_REACTIONS"], // MANAGE_MESSAGES
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ guild, author, channel, language }, t) {
        const embed = new ClientEmbed(author)
            .setAuthor(author.username, this.client.user.displayAvatarURL);

        const support = await this.client.utils.get('links', 'support')
            .then(({ redirect }) => { return redirect });

        return channel.send(embed
            .setDescription(t('comandos:bugreport.wait'))
        ).then((msg) => {
            msg.react(Emojis.reactions.wait);
            return channel.awaitMessages(msg => msg.author.id === author.id, {
                max: 1,
                time: 120000,
                errors: ['time']
            }).then(async (report) => {
                const REPORT = report.first().content;
                const react = msg.reactions.get(Emojis.reactions.wait);
                react && react.remove(this.client.user.id).catch(() => msg.delete());

                if (REPORT && REPORT.length >= 30 && REPORT.length <= 150) {
                    const link = await this.getArchiveLink(author, guild, REPORT, language);
                    return msg.react(Emojis.reactions.okay).then(() => {
                        msg.edit(embed
                            .setDescription(`${Emojis.Certo} **${author.username}**, ${t('comandos:bugreport.bugSend', { link, support })}`)
                        ).then(this.newBugReport(author, guild, link))
                    })
                } else {
                    const error = (REPORT && REPORT.length < 30
                        ? t('comandos:bugreport.fewFwords') : REPORT && REPORT.length > 150
                            ? t('comandos:bugreport.lotOfwords') : ''
                    )

                    return msg.react(Emojis.reactions.error).then(() => {
                        msg.edit(embed
                            .setDescription(`${Emojis.Errado} **${author.username}**, ${t(error)}`)
                            .setColor(process.env.ERROR_COLOR)
                        )
                    })
                }
            }).catch(() => {
                const react = msg.reactions.get(Emojis.reactions.wait);
                react && react.remove(this.client.user.id).catch(() => msg.delete());

                return msg.react(Emojis.reactions.error).then(() => {
                    msg.edit(embed
                        .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:bugreport.timeOut')}`)
                        .setColor(process.env.ERROR_COLOR)
                    )
                })
            }).catch(() => { })
        }).catch(() => { });
    }

    async newBugReport(author, guild, link, channel = JSON.parse(process.env.UTILS_LOGS)['BUG_REPORT']) {
        return this.client.ShardUtils.send(process.env.GUILD_ID, channel, (new ClientEmbed(author)
            .setDescription("Novo Report Enviado!")
            .addField("Author", author.tag, false)
            .addField("No Servidor", `${guild.name} \`(${guild.id})\``, false)
            .addField("Conteúdo", link)
        ))
    }

    async getArchiveLink(author, guild, report, language) {
        moment.locale(language);
        const archive = await this.client.pastebinAPI.post((
            `Data: ${moment(new Date()).format('LLLL')}\nEnviado Por: ${author.tag}\nNo Servidor: ${guild.name} || ${guild.id}\nConteúdo: ${report.replace(/(\*|~+|`)/g, '')}`
        ), `${this.client.user.username} BUG-REPORT`)

        return `https://pastebin.com/raw/${archive.split('pastebin.com/')[1]}`
    }
}

module.exports = BugReport;