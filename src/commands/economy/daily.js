const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../..");

class Daily extends Command {
    constructor(client) {
        super(client, {
            name: "daily",
            description: "Dá os creditos diarios",
            usage: { args: false, argsNeed: false},
            category: "Economy",
            cooldown: 3000,
            aliases: ["diario", "pagamento"],
            Permissions: ["EMBED_LINKS"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, message,author }, t, { displayAvatarURL } = this.client.user) {
        
        await this.client.database.users.verificar(message.author.id) || await this.client.database.users.add({ _id: message.author.id });

            const EMBED = new ClientEmbed(author)
                .setAuthor(this.client.user.username, displayAvatarURL)

                let vip = await this.client.database.users.findOne(message.author.id).then(u => u.vip)
                let vip1 = 1
            if(vip.active = true) {
                vip1 = Math.round(Math.random() * 99 )
            };
                let coins1 = Math.round(Math.random() * 200 ) + vip1;
                let coins2 = user.coins + parseInt(coins1)

                user = message.author             
                await this.client.DatabaseUtils.daily(user, coins2)
    
                    .catch((err) => { throw new ErrorCommand(err) });

                return channel.send(EMBED
                    .setDescription(Emojis.Certo + t("clientMessages:Daily", {money:coins1}))
                    .setColor(process.env.COLOR_EMBED)
        )  
    }
}
module.exports = Daily;