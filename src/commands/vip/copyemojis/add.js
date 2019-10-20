const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../../");

const inCopy = [];

class SetCopyEmojis extends Command {
    constructor(client) {
        super(client, {
            name: "add",
            description: "Clona os emojis de um servidor para outro!",
            usage: { args: true, argsNeed: true, argsTxt: "<id|name>", need: "{args}" },
            category: "vip",
            aliases: ["set", "setar", "adicionar"],
            referenceCommand: 'copyemojis',
            Permissions: ["MANAGE_EMOJIS"],
            UserPermissions: ["MANAGE_EMOJIS"]
        }, true);
    }

    async run({ channel, guild, author, args, prefix }, t) {
        const embed = new ClientEmbed(author);
        const { utils: { copyEmojis } } = await this.client.database.users.findOne(author.id);

        if (args[1]) {
            const emojisCopy = copyEmojis.find(d => d.guildID == args[1] || d.guildName.toLowerCase() == args.slice(1).join(' ').toLocaleLowerCase());

            if (emojisCopy && emojisCopy.guildID != guild.id) {
                let copySucess = 0;
                let i = 0;
                let msgResponse = await channel.send(Emojis.Loading);

                for (const emoji of emojisCopy.emojis) {
                    ++i
                    await guild.createEmoji(emoji.url, emoji.name).then(() => {
                        ++copySucess
                        return msgResponse.edit(`**${i}°** \`:\` ${Emojis.Sucess}`);
                    }).catch(() => msgResponse.edit(`**${i}°** \`:\` ${Emojis.Unsuccess}`));
                    await new Promise((r, j) => setTimeout(r, 1000));
                }

                const response = copySucess == emojisCopy.emojisSize ? 'copySuccess' : 'finallyCopy'
                return channel.send(embed
                    .setDescription(`${Emojis.Certo} **${author.username}**, ${t(`comandos:copyemojis.subcommands.${response}`
                        , {
                            size: copySucess
                        }
                    )}`)
                )
            } else {
                const error = emojisCopy ? 'copyInItServer' : 'noServerFind'
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t(`comandos:copyemojis.subcommands.${error}`
                        , {
                            prefix
                        }
                    )}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:copyemojis.subcommands.noArgsSet')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = SetCopyEmojis;