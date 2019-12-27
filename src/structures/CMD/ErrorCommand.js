const ClientEmbed = require("../ClientEmbed.js");

module.exports = class CommandError extends Error {
    constructor(message) {
        super(message);
    }

    static async commandError(client, channel, command, used, prefix, t, error, { displayAvatarURL } = client.user) {
        console.log(error)
        try {
            const support = await client.utils.get('links', 'support').then(({ redirect }) => redirect);
            return channel.send(new ClientEmbed(used)
                .setAuthor(client.user.username, displayAvatarURL)
                .setDescription(t('errors:CommandError.description', { prefix: prefix, support }))
                .setFooter(t('errors:CommandError.footer', { user: client.user.username }), used.displayAvatarURL ? used.displayAvatarURL : displayAvatarURL)
                .setColor(process.env.ERROR_COLOR)
            ).then(() => {
                const EMBED = new ClientEmbed(used);
                const CHANNEL = (JSON.parse(process.env.UTILS_LOGS)['ERROR']);

                if (channel.guild) {
                    EMBED.addField("No Servidor:", channel.guild.name + ' `(' + channel.guild.id + ')`', true)
                }

                client.ShardUtils.send(process.env.GUILD_ID, CHANNEL
                    , EMBED
                        .setColor(process.env.ERROR_COLOR)
                        .setTitle("Erro ao executar um Comando")
                        .addField("Comando", command.commandHelp.name, true)
                        .addField("Usado Por:", used.tag, true)
                        .addField("Erro", error.message ? error.message : error)
                        .setThumbnail(channel.guild && channel.guild.iconURL ? channel.guild.iconURL : displayAvatarURL)
                )
                return client.LOG_ERR(error, command.commandHelp.name.toUpperCase());
            }).catch(client.LOG_ERR)
        } catch (err) {
            return client.LOG_ERR(err);
        }
    }
}