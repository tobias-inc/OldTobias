const Event = require("../../structures/Event.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class GuildCreate extends Event {
    constructor(client) {
        super(client)
        this.client = client
        this.name = 'guildCreate'
    }

    async ON(guild) {
        const guildDB = await this.client.database.guilds.verificar(guild.id);
        if (!guildDB) await this.client.database.guilds.add({
            _id: guild.id,
            language: this.client.regionsLang.language[guild.region]
        });

        const EMBED = new ClientEmbed(guild.owner.user);
        const INVITE = await guild.fetchInvites()
            .then(invites => {
                if (invites) return invites.random().url
                return false;
            })
            .catch(() => { return false });

        if (INVITE) EMBED.setURL(INVITE).setTitle("INVITE");
        const CHANNEL = JSON.parse(process.env.UTILS_LOGS)['GUILD_CREATE']
        this.client.ShardUtils.send(process.env.GUILD_ID, CHANNEL
            , EMBED
                .setAuthor("Adicionado a Guild", this.client.user.displayAvatarURL)
                .addField("Nome", guild.name, true)
                .addField("ID", guild.id, true)
                .addField("Owner", guild.owner.user.tag, true)
                .addField("Membros", guild.memberCount, true)
                .addField("Canais", guild.channels.size, true)
                .setThumbnail(guild.iconURL ? guild.iconURL : this.client.user.displayAvatarURL)
        )
        return this.client.updatePresence(true);
    }
}