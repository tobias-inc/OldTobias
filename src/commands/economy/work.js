const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../..");

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

        const { vip: { active }, coins, cooldown } = await this.client.database.users.get(author.id)
        const embed = new ClientEmbed(author).setAuthor(this.client.user.username, displayAvatarURL)

        if ((parseInt(cooldown) + 1800000) <= Date.now()) {
            const receivedCoins = (active ? 2 : 1) * Math.round(Math.random() * 350)
            const res = await this.client.database.users.update(
                author,
                {
                    coins: (receivedCoins + coins),
                    cooldown: Date.now()
                }
            ).catch((err) => { throw new ErrorCommand(err) });

            channel.send(embed
                .setDescription(`${Emojis.Certo} ${t("clientMessages:work", { money: receivedCoins })}`)
            ).then(() => res)
        } else {
            const time = moment.duration((parseInt(cooldown) + 1800000) - Date.now(), 'milliseconds').format('hh:mm:ss', { stopTrim: 'm' })
            channel.send(embed.setDescription(`${Emojis.Errado} ${t("errors:cooldown", { time })}`))
        }
    }
}
module.exports = Work;