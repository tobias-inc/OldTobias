const Event = require("../../structures/Event.js");
const ClientEmbed = require("../../structures/ClientEmbed.js");

module.exports = class GuildDeleteEvent extends Event {
    constructor(client) {
        super(client)
        this.client = client
        this.name = 'guildDelete'
    }

    async ON(guild) {
        const guildDB = await this.client.database.guilds.verificar(guild.id);
        if (guildDB) await this.client.database.guilds.remove(guild.id);
        const EMBED = new ClientEmbed(guild.owner.user);
        const CHANNEL = JSON.parse(process.env.UTILS_LOGS)['GUILD_DELETE']
        this.client.ShardUtils.send(process.env.GUILD_ID, CHANNEL
            , EMBED
                .setAuthor("Removido da Guild", this.client.user.displayAvatarURL)
                .addField("Nome", guild.name, true)
                .addField("ID", guild.id, true)
                .addField("Owner", guild.owner.user.tag, true)
                .addField("Membros", guild.memberCount, true)
                .addField("Canais", guild.channels.size, true)
                .setThumbnail(guild.iconURL ? guild.iconURL : this.client.user.displayAvatarURL)
        )
        return this.client.emit('updatePresence', true);
    }
}