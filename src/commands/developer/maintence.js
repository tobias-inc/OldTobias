const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class Maintence extends Command {
    constructor(client) {
        super(client, {
            name: "maintence",
            description: "",
            usage: { args: true, argsNeed: true, argsTxt: "<option> <command>", need: "{prefix} {cmd} {args}" },
            category: "Developer",
            cooldown: 3000,
            aliases: ["manu"],
            Permissions: [],
            UserPermissions: [],
            ownerNeed: true,
            needGuild: false
        });
    }

    async run({ channel, author }, t) {
        const { commands: { subcommands: subcommands } } = this.client;
        return channel.send(new ClientEmbed(author)
            .setDescription(`${Emojis.Errado} **${author.username}** ${t('comandos:noOption', {
                options: subcommands.get(this.category).map(subcommand => subcommand.name).join(', ')
            })}`)
            .setColor(process.env.ERROR_COLOR)
        )
    }
}

module.exports = Maintence;