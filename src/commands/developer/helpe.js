const { Command, Emojis, ClientEmbed } = require("../../");

const msgTimeOut = async (msg, time) => {
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, time)
    })
    return msg.clearReactions().catch(() => { });
}

class Help extends Command {
    constructor(client) {
        super(client, {
            name: "helpe",
            description: "Painel de ajuda do bot",
            usage: { args: true, argsNeed: false },
            category: "Bot",
            cooldownTime: 3000,
            aliases: [],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ channel, author, args, prefix, language }, t, usage = this.name, numField = 0) {

        const embed = new ClientEmbed(author)
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
            .setThumbnail(this.client.user.displayAvatarURL);

        const command = args[0] ? this.client.commands.all
            .filter(cmd => cmd.commandHelp.category !== 'Developer')
            .find(cmd => cmd.commandHelp.name.toLowerCase() === args[0].toLowerCase() ||
                cmd.commandHelp.aliases && cmd.commandHelp.aliases.includes(args[0].toLowerCase())
            ) : false

        if (command) return this.commandHelp(channel, embed, command, language, prefix, args, t);
        console.log(command)
        const categories = this.client.commands.categories.filter(({ name, size }) => name !== 'developer' && size);
        console.log("\n \n \n")

        while (categories.length > numField && numField <= 25) {
            const current = categories[numField];
            embed.addField(`${t(`utils:categories.${current.name}`)} **(${current.size})**`, (
                this.client.commands.all.filter(
                    file => file.commandHelp.category.toLowerCase() === current.name.toLowerCase()
                ).map(cmd =>`\`${cmd.commandHelp.name}\``).join(', ')
            ), false);
            ++numField
  
        }

        return channel.send(embed
            .setDescription(t('clientMessages:help.description', { prefix, usage }))
        );
        
    }

    async commandHelp(channel, embed, command, language, prefix, args, t) {
        const { usages } = await this.client.database.comandos.get(command.commandHelp.name);
        const { UserPermissions, Permissions, needGuild, aliases, name } = command.commandHelp;

        const getUsage = (cmd, subcommand = false) => {
            if (cmd.usage && !cmd.usage.args) {
                if (subcommand) {
                    return `\`${prefix} ${name} ${cmd.name}\``
                } else {
                    return `\`${prefix} ${cmd.name}\``
                }
            }
            else {
                if (!cmd.usage) return false;
                else {
                    if (subcommand) {
                        return `\`${prefix} ${name} ${cmd.name} ${cmd.usage.need.replace(/{args}/gi, cmd.usage.argsTxt)}\``
                    } else {
                        return `\`${cmd.usage.need.replace(/{args}/gi
                            , cmd.usage.argsTxt).replace(/{prefix}/gi
                                , prefix).replace(/{cmd}/gi, cmd.name)}\``
                    }
                }
            }
        }

        const subcommands = (this.client.commands.subcommands.get(command.commandHelp.category) &&
            this.client.commands.subcommands.get(command.commandHelp.category).filter(
                cmd => cmd.referenceCommand == command.commandHelp.name
            )
        ) || false

        if (args[1] && subcommands &&
            subcommands.find(
                cmd => cmd.name.toLowerCase() === args[1].toLowerCase() || cmd.aliases.includes(args[1].toLowerCase())
            )
        ) {
            const subcommand = subcommands.find(
                cmd => cmd.name.toLowerCase() === args[1].toLowerCase() || cmd.aliases.includes(args[1].toLowerCase())
            )

            return channel.send(embed
                .addField(t('clientMessages:help.command.description.ctx'), (
                    t(`description:subcommands.${name}.${subcommand.name}`) !== name
                        ? t(`description:subcommands.${name}.${subcommand.name}`)
                        : t('clientMessages:help.command.description.none')
                ), false)
                .addField(t('clientMessages:help.command.name'), subcommand.name, false)
                .addField(t('clientMessages:help.command.aliases.ctx'), (
                    subcommand.aliases.length
                        ? subcommand.aliases.map(aliase => `\`${aliase}\``).join(', ')
                        : t('clientMessages:help.command.aliases.none')
                ), false)
                .addField(t('clientMessages:help.command.usage.ctx'), (
                    getUsage(subcommand, true) || t('clientMessages:help.command.usage.none')
                ), false)
            )
        }

        return channel.send(embed
            .addField(t('clientMessages:help.command.description.ctx'), (
                t(`description:commands.${name}`) !== name
                    ? t(`description:commands.${name}`)
                    : t('clientMessages:help.command.description.none')
            ), false)
            .addField(t('clientMessages:help.command.usage.ctx'), (
                getUsage(command.commandHelp) || t('clientMessages:help.command.usage.none')
            ), false)
            .addField(t('clientMessages:help.command.name'), name, true)
            .addField(t('clientMessages:help.command.needGuild.ctx'), t(`clientMessages:help.command.needGuild.${needGuild}`), true)
            .addField(t('clientMessages:help.command.aliases.ctx'), (
                aliases.length
                    ? aliases.map(aliase => `\`${aliase}\``).join(', ')
                    : t('clientMessages:help.command.aliases.none')
            ), true)
            .addField(t('clientMessages:help.command.mePerms.ctx'), (
                Permissions.length
                    ? Permissions.map(perm => `\`${perm}\``).join(', ')
                    : t(`clientMessages:help.command.mePerms.none`)
            ), false)
            .addField(t('clientMessages:help.command.userPerms.ctx'), (
                UserPermissions.length
                    ? UserPermissions.map(perm => `\`${perm}\``).join(', ')
                    : t(`clientMessages:help.command.userPerms.none`)
            ), false)
            .addField(t('clientMessages:help.command.subcommands.ctx'), (
                !subcommands && t('clientMessages:help.command.subcommands.none')
                || subcommands.map(cmd => `\`${cmd.name}\``).join(', ')
                + `\n\n${t('clientMessages:help.command.subcommands.usage', { prefix, name })}`
            ), false)
            .addField(t('clientMessages:help.command.usages'), Number(usages).localeNumber(language), false)
        )
    }
}

module.exports = Help;