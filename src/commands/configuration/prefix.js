const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class prefix extends Command {
    constructor(client) {
        super(client, {
            name: "prefix",
            description: "Modifica o prefixo do servidor",
            usage: { args: true, argsNeed: true, argsTxt: "<prefix>", need: "{prefix} {cmd} {args}" },
            category: "Configuration",
            cooldownTime: 3000,
            aliases: [],
            Permissions: [],
            UserPermissions: ["MANAGE_GUILD"],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, guild, author, args }, t) {
        const embed = new ClientEmbed(author);

        if (args[0]) {
            const prefix = args.join(' ');

            if (!(prefix.length > 10 || prefix.includes(' '))) {
                await this.client.DatabaseUtils.setPrefix(guild, prefix)
                    .catch((err) => { throw new ErrorCommand(err) });

                return channel.send(embed
                    .setDescription(`${Emojis.Settings} **${author.username}**, ${t('comandos:prefix.setPrefix', { prefix })}`)
                )
            } else {
                const error = (prefix.length > 10 ? 'comandos:prefix.ultrapassedLength' : 'comandos:prefix.containsSpaces');
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t(error)}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:prefix.noArgs')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = prefix;