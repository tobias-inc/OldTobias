const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../..");
const moment = require('moment');

class Daily extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            description: "Te dá os Biscoitos Tobias diarios.",
            usage: { args: false, argsNeed: false },
            category: "Economy",
            cooldownTime: 86400000,
            aliases: ["diario", "pagamento"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, author, author }, t, { displayAvatarURL } = this.client.user) {
        const { vip: { active }, coins, cooldown } = await this.client.database.users.get(author.id)
        const embed = new ClientEmbed(author).setAuthor(this.client.user.username, displayAvatarURL)

        if ((parseInt(cooldown) + 86400000) <= Date.now()) {
            const receivedCoins = (active ? 2 : 1) * Math.round(Math.random() * 350)
            const res = await this.client.DatabaseUtils.daily(
                user, (receivedCoins + coins)
            ).catch((err) => { throw new ErrorCommand(err) });

            channel.send(embed
                .setDescription(`${Emojis.Certo} ${t("clientMessages:Daily", { money: receivedCoins })}`)
            ).then(() => res)
        } else {
            const time = moment.duration((parseInt(cooldown) + 86400000) - Date.now(), 'milliseconds').format('hh:mm:ss', { stopTrim: 'm' })
            channel.send(embed.setDescription(`${Emojis.Errado} ${t("erro", { time })}`))
        }
    }
}
module.exports = Daily;