const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../..");

class ClientMaintence extends Command {
    constructor(client) {
        super(client, {
            name: "bot",
            description: "",
            usage: { args: false, argsNeed: false },
            category: "Developer",
            aliases: ["client", "me"],
            referenceCommand: 'maintencecmd',
            Permissions: [],
            UserPermissions: []
        }, true);
    }



    async run({ channel, author }, t, opt) {
        const embed = new ClientEmbed(author);
        const client = await this.client.database.clientUtils.get(this.client.user.id);
        const valBool = opt.boolean === client.maintence;

        if (valBool) {

            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t(`comandos:maintencecmd.subcommands.client.false${opt.type}`)}`)
                .setColor(process.env.ERROR_COLOR)
            )

        } else {
            await this.client.DatabaseUtils['ClientMaintence'](opt.boolean)
                .catch((err) => { throw new ErrorCommand(err) });

            return channel.send(embed
                .setDescription(`${Emojis.Certo} **${author.username}**, ${t(`comandos:maintencecmd.subcommands.client.true${opt.type}`)}`)
            )
        }
    }
}

module.exports = ClientMaintence;