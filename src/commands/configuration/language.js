const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class Language extends Command {
    constructor(client) {
        super(client, {
            name: "language",
            description: "Modifica a tradução do servidor",
            usage: { args: true, argsNeed: true, argsTxt: "<language>", need: "{prefix} {cmd} {args}" },
            category: "Configuration",
            cooldown: 3000,
            aliases: ["lang"],
            Permissions: [],
            UserPermissions: ["MANAGE_GUILD"],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, guild, author, args, prefix }, t) {
        const i18next = this.client.language.i18next;
        const embed = new ClientEmbed(author);

        if (args[0]) {
            const parameter = await this.GET_ALIASE(args.join(' '));

            if (parameter) {
                if (parameter.help) {
                    return channel.send(await this.getLangsHelp({ prefix, embed, t }));
                } else {
                    await this.client.DatabaseUtils.setLanguage(guild, parameter.type)
                        .catch((err) => { throw new ErrorCommand(err) });

                    return channel.send(embed
                        .setDescription(`${Emojis.Settings} **${author.username}**, ${(
                            i18next.getFixedT(parameter.type)('comandos:language.setLang', {
                                lang: parameter.name
                            }))}`
                        )
                    )
                }
            } else {
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:language.noLang', {
                        prefix,
                        name: this.name,
                        help: (await this.GET_LANGUAGES(true)),
                        lang: args.join(' ')
                    })}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:language.noArgs', {
                    prefix,
                    name: this.name,
                    help: (await this.GET_LANGUAGES(true))
                })}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }

    async getLangsHelp({ prefix, embed, t }) {
        return embed.setDescription(`${Emojis.Info} ${t('comandos:language.help', {
            prefix,
            name: this.name,
            langs: await this.GET_LANGUAGES('all').then(langs => {
                return langs.map(lng => `ID: \`${lng.type}\` - ${lng.name}`).join('\n')
            })
        })}`)
    }

    async GET_LANGUAGES(help = false) {
        let response = false;

        if (help === true) {
            response = this.client.language.options.aliases
                .filter(get => get.help)
                .map(parameter => `${parameter.aliase.map(a => a).join(' || ')}`).join(' | ')
        } else if (help === 'all') {
            response = this.client.language.options.aliases.filter(get => !get.help)
        } else {
            response = '[' + this.client.language.options.aliases
                .filter(get => !get.help)
                .map(parameter => (
                    `${parameter.aliase.map(a => a).slice(0, 1)}`
                )).join(' | ') + ']'
        }
        return response;
    }

    async GET_ALIASE(msg) {
        return await this.client.language.options.aliases.find(get => get.aliase.some(aliase => (
            aliase.toLowerCase() === msg.toLowerCase()
        )));
    }
}

module.exports = Language;