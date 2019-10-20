const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../../");

class RemoveCopyEmojis extends Command {
    constructor(client) {
        super(client, {
            name: "removeemoji",
            description: "Remove um servidor clonado da lista!",
            usage: { args: true, argsNeed: true, argsTxt: "<id|name>", need: "{args}" },
            category: "Utils",
            aliases: ["emojiremove", "removeremoji", "re"],
            referenceCommand: 'copyemojis',
            Permissions: [],
            UserPermissions: []
        }, true);
    }

    async run({ channel, author, args, prefix }, t) {
        const embed = new ClientEmbed(author);
        const { utils: { copyEmojis } } = await this.client.database.users.findOne(author.id);

        if (args[1] && copyEmojis.length) {
            const emojis = copyEmojis.find(d => d.guildID == args[1] || d.guildName.toLowerCase() == args.slice(1).join(' ').toLocaleLowerCase());

            if (emojis) {
                await this.client.DatabaseUtils.removeCopyEmojis(emojis, author)
                    .catch((err) => { throw new ErrorCommand(err) });

                return channel.send(embed
                    .setDescription(`${Emojis.Certo} **${author.username}**, ${t(`comandos:copyemojis.subcommands.deleteSucess`
                        , {
                            guild: emojis.guildName
                        }
                    )}`)
                )
            } else {
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t(`comandos:copyemojis.subcommands.noGuildEmojis`
                        , {
                            prefix
                        }
                    )}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            const error = args[1] ? 'noSavedEmojis' : 'noArgsRemove';
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t(`comandos:copyemojis.subcommands.${error}`)}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = RemoveCopyEmojis;