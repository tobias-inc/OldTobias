const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class MaintenceCommand extends Command {
    constructor(client) {
        super(client, {
            name: "maintencecmd",
            description: "",
            usage: { args: true, argsNeed: true, argsTxt: "<option> <command>", need: "{prefix} {cmd} {args}" },
            category: "Developer",
            cooldownTime: 3000,
            aliases: ["maintence", "manu", "manucmd", "manu-cmd", "manumanu", "cmd-manu"],
            Permissions: [],
            UserPermissions: [],
            ownerNeed: true,
            needGuild: false
        });
    }

    async run(settings, t, { channel, author, args } = settings) {
        const embed = new ClientEmbed(author);
        const option = await this.GET_OPTION(args[0]);

        if (option && !option.list) {
            let command = args[1] ? this.client.commands.all.find(
                cmd => cmd.commandHelp.name.toLowerCase() === args.slice(1).join(' ').toLowerCase() ||
                    cmd.commandHelp.aliases && cmd.commandHelp.aliases.includes(args.slice(1).join(' ').toLowerCase())
            ) : false;

            if (command) {
                const commandDoc = await this.client.database.comandos.verificar(command.commandHelp.name);

                if (commandDoc) {
                    command = await this.client.database.comandos.findOne(command.commandHelp.name);
                    let valBool = option.boolean === command.maintence;
                    if (valBool) {
                        return channel.send(embed
                            .setDescription(`${Emojis.Errado} **${author.username}**, ${t(`comandos:maintencecmd.${option.error}`, {
                                command: command._id
                            })}`)
                            .setColor(process.env.ERROR_COLOR)
                        )
                    } else {
                        await this.client.DatabaseUtils['CommandMaintence'](command._id, option.boolean)
                            .catch((err) => { throw new ErrorCommand(err) });

                        return channel.send(embed
                            .setDescription(`${Emojis.Certo} **${author.username}**, ${t(`comandos:maintencecmd.${option.send}`, {
                                command: command._id
                            })}`)
                        )
                    }
                } else {
                    return channel.send(embed
                        .setDescription(`${Emojis.Errado} **${author.username}**, ${t(`comandos:maintencecmd.noCommandDatabase`, {
                            command: args.slice(1).join(' ')
                        })}`)
                        .setColor(process.env.ERROR_COLOR)
                    )
                }
            } else {
                if (args[1]) {
                    const subcommand = this.client.commands.subcommands.get(this.category).find(
                        cmd => cmd.name.toLowerCase() === args[1].toLowerCase() || cmd.aliases.includes(args[1].toLowerCase())
                    )
                    if (subcommand) return subcommand.run(settings, t, option)
                }
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t(`comandos:maintencecmd.noCommand`)}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            if (option && option.list) {
                const { maintence } = await this.client.database.clientUtils.findOne(this.client.user.id)
                const responses = [
                    (t('comandos:maintencecmd.MaintenceList.me', {
                        res: maintence ? t('comandos:maintencecmd.MaintenceList.yes') : t('comandos:maintencecmd.MaintenceList.no')
                    })),
                    (t('comandos:maintencecmd.MaintenceList.commands', {
                        list: await this.client.database.comandos.findAll().then((docs) => {
                            const Inmaintence = docs.filter(cmd => cmd.maintence);
                            return (Inmaintence.length
                                ? Inmaintence.map(cmd => `\`${cmd._id}\``).join(', ')
                                : t('comandos:maintencecmd.MaintenceList.none')
                            )
                        })
                    }))
                ].join('\n\n')
                return channel.send(embed
                    .setDescription(responses)
                    .setThumbnail(this.client.user.displayAvatarURL)
                    .setAuthor(`${this.client.user.username} - ${t('comandos:maintencecmd.MaintenceList.ctx')}`, this.client.user.displayAvatarURL)
                )
            } else {
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}** ${t('comandos:maintencecmd.noOption', {
                        options: await this.GET_OPTIONS()
                    })}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        }
    }

    GET_OPTIONS() {
        return '[' + this.client.Aliases['maintencecmd'].map(parameter => (
            `${parameter.aliase.map(a => a).slice(0, 1)}`
        )).join(' | ') + ']'
    }

    async GET_OPTION(msg) {
        if (!msg) return false;
        return await this.client.Aliases['maintencecmd'].find(get => get.aliase.includes(msg.toLowerCase()));
    }
}

module.exports = MaintenceCommand;