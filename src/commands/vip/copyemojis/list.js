const { Command, Emojis, ClientEmbed } = require("../../../");

class ListCopyEmojis extends Command {
    constructor(client) {
        super(client, {
            name: "list",
            description: "Lista todos os servidores clonados!",
            usage: { args: false, argsNeed: false },
            category: "Utils",
            aliases: ["listar", "lista"],
            referenceCommand: 'copyemojis',
            Permissions: [],
            UserPermissions: []
        }, true);
    }

    async run({ channel, author, prefix }, t) {
        const embed = new ClientEmbed(author);
        const { utils: { copyEmojis } } = await this.client.database.users.findOne(author.id);

        return channel.send(embed
            .setDescription(
                [
                    t('comandos:copyemojis.subcommands.list.ctx'),
                    copyEmojis.length && '\n' + copyEmojis.map(vb => `**ID: \`${vb.guildID}\` - ${vb.guildName}**`).join('\n') + `\n\n${t('comandos:copyemojis.subcommands.list.usage', { prefix })}`
                    || '\n' + t('comandos:copyemojis.subcommands.list.noSavedEmojis')
                ].join('\n')
            )
        )
    }
}

module.exports = ListCopyEmojis;