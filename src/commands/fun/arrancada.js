const {
    Discord = require("discord.js"),
    Command, ClientEmbed, Emojis
} = require("../../");

class arrancada extends Command {
    constructor(client) {
        super(client, {
            name: "arrancada",
            description: "Aposta uma corrida com um usuario",
            usage: { args: true, argsNeed: true, argsTxt: "<user>", need: "{prefix} {cmd} {args}" },
            category: "Fun",
            cooldownTime: 3000,
            aliases: ["racha", "arranca", "run"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args }, t, { displayAvatarURL } = this.client.user) {

        const user = (await this.GetUser(args[0], message, guild));
        if (!user) return message.reply(t('clientMessages:Arrancada.noUser'));
        var Açoes = ["**200**", "**500**", " **800** ", " **1000** ", " **1500**", "**1800**"];
        const corrida = Açoes[Math.round(Math.random() * Açoes.length)]
        const corrida2 = Açoes[Math.round(Math.random() * Açoes.length)]

        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)

        let winner;
        if (corrida < corrida2) winner = user;
        if (corrida > corrida2) winner = message.author;
        if (corrida === corrida2) return channel.send(t("clientMessages:Arrancada.draw"))

        return channel.send(EMBED
            .setTitle(t("clientMessages:Arrancada.win", { ganhador: winner.username }))
            .setColor(process.env.COLOR_EMBED)
            .setThumbnail(winner.displayAvatarURL)
            .addField(t(`clientMessages:Arrancada.challenger`), t("clientMessages:Arrancada.makes", { action: corrida, author: user }))
            .addField(t(`clientMessages:Arrancada.challenged`), t("clientMessages:Arrancada.makes", { action: corrida2, author: message.author }))
                )
    }
}
module.exports = arrancada;