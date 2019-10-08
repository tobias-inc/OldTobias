const { Command, Emojis, ClientEmbed } = require("../../");

class ReloadLocales extends Command {
    constructor(client) {
        super(client, {
            name: "reloadlocales",
            description: "Recarrega o sistema de linguagem",
            usage: { args: false, argsNeed: false },
            category: "Developer",
            cooldownTime: 3000,
            aliases: ["locales", "rlc"],
            Permissions: [],
            UserPermissions: [],
            devNeed: true,
            needGuild: false
        });
    }

    async run({ channel, author }, t) {
        const embed = new ClientEmbed(author);
        const loaded = await (this.client.language.LoaderLanguage());

        if (loaded) {
            return channel.send(embed
                .setDescription(`${Emojis.Certo} **${author.username}**, ${t('comandos:reloadlocales.loaded')}`)
            )
        } else {
            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:reloadlocales.noloaded')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = ReloadLocales;