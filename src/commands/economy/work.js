const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../..");
const moment = require('moment');

class Work extends Command {
    constructor(client) {
        super(client, {
            name: "work",
            description: "Te dá Biscoitos Tobias a cada meia hora.",
            usage: { args: false, argsNeed: false },
            category: "Economy",
            cooldownTime: 0,
            aliases: ["trabalho", "wk"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, author }, t, { displayAvatarURL } = this.client.user) {

        const { vip: { active }, cooldown } = await this.client.database.users.findOne(author.id)
        const embed = new ClientEmbed(author).setAuthor(this.client.user.username, displayAvatarURL)

        if ((parseInt(cooldown) + 1800000) <= Date.now()) {
            const receivedCoins = Math.round((Math.random() * (35 - 15) + 15)) * (active ? 2 : 1);
            await this.client.DatabaseUtils.daily(author, receivedCoins).catch((err) => { throw new ErrorCommand(err) });
            channel.send(embed.setDescription(`${Emojis.Certo} ${t("clientMessages:work", { money: receivedCoins })}`))
        } else {
            const time = moment.duration((parseInt(cooldown) + 1800000) - Date.now(), 'milliseconds').format('hh:mm:ss', { stopTrim: 'm' })
            channel.send(embed.setDescription(`${Emojis.Errado} ${t("errors:cooldown", { time })}`))
        }
    }
}
module.exports = Work;