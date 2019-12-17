const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../..");
const moment = require('moment');

class Daily extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            description: "Te dá os Biscoitos Tobias diarios.",
            usage: { args: false, argsNeed: false },
            category: "Economy",
            cooldownTime: 0,
            aliases: ["diario", "pagamento"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, author }, t, { displayAvatarURL } = this.client.user) {
        const { vip: { active }, cooldown } = await this.client.database.users.findOne(author.id)
        const embed = new ClientEmbed(author).setAuthor(this.client.user.username, displayAvatarURL)

        if ((parseInt(cooldown) + 86400000) <= Date.now()) {
            const receivedCoins = Math.round((Math.random() * (300 - 150) + 150)) * (active ? 2 : 1);
            await this.client.DatabaseUtils.daily(author, receivedCoins).catch((err) => { throw new ErrorCommand(err) });
            channel.send(embed.setDescription(`${Emojis.Certo} ${t("clientMessages:Daily", { money: receivedCoins })}`))
        } else {
            const time = moment.duration((parseInt(cooldown) + 86400000) - Date.now(), 'milliseconds').format('hh:mm:ss', { stopTrim: 'm' })
            channel.send(embed.setDescription(`${Emojis.Errado} ${t("errors:cooldown", { time })}`))
        }
    }
}
module.exports = Daily;