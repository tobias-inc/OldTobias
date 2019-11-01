const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class setChannel extends Command {
    constructor(client) {
        super(client, {
            name: "setChannel",
            description: "Me deixa falar apenas em um chat",
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

    async run({ channel, guild, author, args, message }, t) {
        const embed = new ClientEmbed(author);

        if (args[0]) {
            const CHANNEL = await this.GetChannel(args, message, guild, channel);

            if (CHANNEL) {
                await this.client.DatabaseUtils.setChannel(guild, CHANNEL)
                    .catch((err) => { throw new ErrorCommand(err) });

                return channel.send(embed
                    .setDescription(`${Emojis.Settings} **${author.username}**, ${t('comandos:setChannel', { CHANNEL: CHANNEL.id })}`)
                )
            } else {
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t('errors:404')}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t('errors:noArgs')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = setChannel;