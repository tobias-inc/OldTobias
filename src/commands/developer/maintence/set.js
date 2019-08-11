const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../..");

class SetMaintence extends Command {
    constructor(client, dir) {
        super(client, {
            name: "set",
            description: "",
            usage: { args: true, argsNeed: true, argsTxt: "<[command(name|aliase)|client]>", need: "{args}" },
            category: "Developer",
            aliases: ["colocar"],
            directory: dir,
            referenceCommand: 'maintence',
            Permissions: [],
            UserPermissions: []
        }, true);
    }

    async run({ channel, author, args }, t) {
        const embed = new ClientEmbed(author);

        if (args[1]) {
            if (['client', 'bot'].includes(args[1])) {
                const clientDoc = await this.client.database.clientUtils.findOne(this.client.user.id);

                if (clientDoc.maintence) return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:maintence.subcommands.set.client.falseSet')}`)
                    .setColor(process.env.ERROR_COLOR)
                );
                else {
                    await this.client.DatabaseUtils.ClientMaintence(true)
                        .catch((err) => { throw new ErrorCommand(err) });

                    return channel.send(embed
                        .setDescription(`${Emojis.Certo} **${author.username}**, ${t('comandos:maintence.subcommands.set.client.trueSet')}`)
                    )
                }
            } else {
                const command = this.client.commands.all.find(
                    cmd => cmd.commandHelp.name.toLowerCase() === args.slice(1).join(' ').toLowerCase() ||
                        cmd.commandHelp.aliases && cmd.commandHelp.aliases.includes(args.slice(1).join(' ').toLowerCase())
                )

                if (command) {
                    const commandDoc = await this.client.database.comandos.get(command.commandHelp.name);

                    if (commandDoc.maintence) return channel.send(embed
                        .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:maintence.subcommands.set.alreadyInMaintence', {
                            command: commandDoc._id
                        })}`)
                        .setColor(process.env.ERROR_COLOR)
                    )
                    else {
                        await this.client.DatabaseUtils.CommandMaintence(commandDoc._id, true)
                            .catch((err) => { throw new ErrorCommand(err) });

                        return channel.send(embed
                            .setDescription(`${Emojis.Certo} **${author.username}**, ${t('comandos:maintence.subcommands.set.commandInMaintence', {
                                command: commandDoc._id
                            })}`)
                        )
                    }
                } else {
                    return channel.send(embed
                        .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:maintence.subcommands.set.noCommand')}`)
                        .setColor(process.env.ERROR_COLOR)
                    )
                }
            }
        } else {
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:maintence.subcommands.set.noCommand')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = SetMaintence;