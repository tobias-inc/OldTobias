const {
    Discord = require("discord.js"),
    superagent = require('superagent'),
    Command, ClientEmbed, Emojis
} = require("../../");

class Abraçar extends Command {
    constructor(client) {
        super(client, {
            name: "abraçar",
            description: "Abraça um usuário",
            usage: { args: true, argsNeed: true, argsTxt: "<user>", need: "{prefix} {cmd} {args}" },
            category: "Fun",
            cooldown: 3000,
            aliases: ["abracar", "hug"],
            Permissions: ["ATTACH_FILES"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args }, t, { displayAvatarURL } = this.client.user) {
        const USER = (await this.GetUser(args[0], message, guild));
        const { body } = await superagent
            .get(`https://nekos.life/api/v2/img/hug`);

        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)

        if (!USER) {
            return channel.send(EMBED
                .setDescription(`${Emojis.Errado} | **${author.username}**  ${t('comandos:abraçar.noArgs')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        };

        if (USER === message.author) return channel.send(`${Emojis.Triste} | ${t(`comandos:abraçar.hugyourself`)} `);
        if (USER === this.client.user) return channel.send(`${Emojis.Triste} | ${t(`comandos:abraçar.Client`)}`)

        let hm = await channel.send(EMBED
            .setDescription(`${Emojis.Love} | ${message.author} ${t(`clientMessages:Abracar.huged`)} ${USER}`)
            .setImage(body.url)
            .setColor(process.env.COLOR_EMBED)
        )
        
        const emojis = [`${Emojis.Again}`];
        for (const i in emojis) {
            await hm.react(emojis[i])
        }
        const filter = (reaction) => [Emojis.Again].includes(reaction.emoji.id);
        const collector = hm.createReactionCollector(filter, { time: 90000 })
        collector.on("collect", r => {
            switch (r.emoji.id) {
                case `${Emojis.Again}`:
                    channel.send(EMBED
                        .setDescription(`${Emojis.Love} | ${USER} ${t(`clientMessages:Abracar.huged`)} ${message.author}`)
                        .setImage(body.url)
                        .setColor(process.env.COLOR_EMBED)
                    )
                    break;
            }
        })
        
    }
}
module.exports = Abraçar;