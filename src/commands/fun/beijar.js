const {
    Discord = require("discord.js"),
    superagent = require('superagent'),
    Command, ClientEmbed, Emojis
} = require("../../");

class Beijar extends Command {
    constructor(client) {
        super(client, {
            name: "beijar",
            description: "beija um usuário",
            usage: { args: true, argsNeed: true, argsTxt: "<user>", need: "{prefix} {cmd} {args}" },
            category: "Fun",
            cooldown: 3000,
            aliases: ["kiss", "beijo"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args }, t, { displayAvatarURL } = this.client.user) {
        const USER = (await this.GetUser(args[0], message, guild));
        const { body } = await superagent
            .get(`https://nekos.life/api/v2/img/kiss`);

        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)

        if (!USER) {
            return channel.send(EMBED
                .setDescription(`${Emojis.Errado} | **${author.username}**  ${t('comandos:kiss.noArgs')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        };

        if (USER === message.author) return channel.send(`${Emojis.Triste} | ${t(`comandos:kiss.kissyourself`,{ USER: message.author })} `);
        if (USER === this.client.user) return channel.send(`${Emojis.Triste} | ${t(`comandos:kiss.Client`, { USER: message.author })}`)

        return channel.send(EMBED
            .setDescription(`${Emojis.Love} | ${message.author} ${t(`clientMessages:Kiss.kissed`)} ${USER}`)
            .setImage(body.url)
            .setColor(process.env.COLOR_EMBED)
        )
    }
}
module.exports = Beijar;