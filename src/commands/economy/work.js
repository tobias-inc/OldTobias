const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../..");

class Work extends Command {
    constructor(client) {
        super(client, {
            name: "work",
            description: "Te dá Biscoitos Tobias a cada meia hora.",
            usage: { args: false, argsNeed: false },
            category: "Economy",
            cooldownTime: 1800000,
            aliases: ["trabalho", "wk"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, message, author }, t, { displayAvatarURL } = this.client.user) {
        await this.client.database.users.verificar(message.author.id) || await this.client.database.users.add({ _id: message.author.id });

        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)

        let vip = await this.client.database.users.findOne(message.author.id).then(u => u.vip)
        let vip1 = 1
        if (vip.active = true) {
            vip1 = Math.round(Math.random() * 50)
        };
        let user = await this.client.database.users.findOne(message.author.id)
        let coins1 = Math.round(Math.random() * 80) + vip1;
        let coins2 = user.coins + parseInt(coins1)

        user = message.author
        await this.client.DatabaseUtils.daily(user, coins2)

            .catch((err) => { throw new ErrorCommand(err) });

        return channel.send(EMBED
            .setDescription(Emojis.Certo + t("clientMessages:work", { money: coins1 }))
            .setColor(process.env.COLOR_EMBED)
        )
    }
}
module.exports = Work;