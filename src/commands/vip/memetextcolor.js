const { Command, Emojis, ClientEmbed, Color } = require("../../");

require("moment-duration-format");

const vipUtils = {
    'BPD': 28800000,
    'DBL': 43200000
}

class MemeTextColor extends Command {
    constructor(client) {
        super(client, {
            name: "memetextcolor",
            description: "Altera a cor do texto do meme a ser criado",
            usage: { args: true, argsNeed: true, argsTxt: "<color>", need: "{prefix} {cmd} {args}" },
            category: "Vip",
            cooldown: 3000,
            aliases: ["meme-color", "color-meme"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: false,
            vipUser: true
        });
    }

    async run({ args, author, channel }, t) {
        const embed = new ClientEmbed(author);
        if (args[0]) {
            const color = new Color(args[0]);
            if (color.valid) {
                await this.client.database.users.update(author.id, { $set: { 'premiumUtils.textcolor': color.rgb(true) } });
                return channel.send(embed
                    .setDescription(t('comandos:memetextcolor.colorSet', { color: color.rgb(true) }))
                    .setThumbnail('http://www.singlecolorimage.com/get/' + color.rgb(true).replace("#", "") + '/40X40')
                    .setColor(color.rgb(true))
                )
            } else {
                return channel.send(embed
                    .setDescription(t('comandos:memetextcolor.errColor'))
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            return channel.send(embed
                .setDescription(t('comandos:memetextcolor.errArgs'))
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }
}

module.exports = MemeTextColor;