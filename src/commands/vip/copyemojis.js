const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class CopyEmojis extends Command {
    constructor(client) {
        super(client, {
            name: "copyemojis",
            description: "Copia todos emojis de um servidor e envia pra outro!",
            usage: { args: true, argsNeed: false, argsTxt: "[subcommand]", need: "{prefix} {cmd} {args}" },
            category: "vip",
            cooldown: 5000,
            aliases: ["copy-emojis", "copiar-emojis", "ce"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true,
        });
    }

    async run(context, t) {
        const { args, author, guild, channel, prefix } = context;
        const subcommand = args[0] && this.client.commands.subcommands.get(this.category).find(
            cmd => cmd.name.toLowerCase() === args[0].toLowerCase() || cmd.aliases.includes(args[0].toLowerCase())
        )
        if (subcommand) {
            return subcommand.verify(context);
        }
        else {
            const embed = new ClientEmbed(author);
            const emojis = guild.emojis;

            if (emojis.size) {
                const userDoc = await this.client.database.users.findOne(author.id);
                const hasEmojisInDb = () => userDoc.utils.copyEmojis.some(ems => ems.guildID == guild.id) ? true : false;

                await this.client.DatabaseUtils.setCopyEmojis(emojis, author, guild, hasEmojisInDb())
                    .catch((err) => { throw new ErrorCommand(err) });;
                return channel.send(embed
                    .setDescription(`${Emojis.Certo} **${author.username}**, ${t(`comandos:copyemojis.${hasEmojisInDb() ? 'copyEmojisUpdate' : 'copySucess'}`
                        , {
                            name: this.name,
                            prefix
                        })}`
                    )
                )
            } else {
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:copyemojis.noEmojisInServer')}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        }
    }
}

module.exports = CopyEmojis;