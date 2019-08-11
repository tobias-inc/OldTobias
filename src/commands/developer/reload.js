const { Command, Emojis, ClientEmbed } = require("../../");

class Reload extends Command {
    constructor(client) {
        super(client, {
            name: "reload",
            description: "Recarrega o comando inserido",
            usage: { args: true, argsNeed: true, argsTxt: "<command>", need: "{prefix} {cmd} {args}" },
            category: "Developer",
            cooldown: 3000,
            aliases: ["r", "rl"],
            Permissions: [],
            UserPermissions: [],
            devNeed: true,
            needGuild: false
        });
    }

    async run({ channel, author, args }, t) {
        const embed = new ClientEmbed(author);
        const command = args[0] ? this.client.commands.all.find(
            cmd => cmd.commandHelp.name.toLowerCase() === args.join(' ').toLowerCase()
                || cmd.commandHelp.aliases && cmd.commandHelp.aliases.includes(args.join(' ').toLowerCase())
        ) : false

        if (args[0] && command) {
            const { error, errorEmit } = await this.client.commands.load(command, t);
            const status = (error ? 'comandos:reload.error' : 'comandos:reload.reloaded');

            if (error) embed.setColor(process.env.ERROR_COLOR);
            return channel.send(embed
                .setDescription(`${error ? Emojis.Errado : Emojis.Certo} **${author.username}**, ${t(status, { err: errorEmit.message, cmd: command.commandHelp.name })}`)
            )
        } else {
            const error = (args[0] ? 'comandos:reload.noCommand' : 'comandos:reload.noArgs');
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t(error, { cmd: args.join(' ') })}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = Reload;