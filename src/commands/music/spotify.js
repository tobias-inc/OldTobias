const {
    Discord = require("discord.js"),
    Attachment = Discord.Attachment,
    ClientEmbed, Command, Emojis
} = require("../../");

class Spotify extends Command {
    constructor(client) {
        super(client, {
            name: "spotify",
            description: "Mostra a música que o usuário está ouvindo no spotify",
            usage: { args: true, argsNeed: false, argsTxt: "[user]", need: "{prefix} {cmd} {args}" },
            category: "Music",
            cooldown: 3000,
            aliases: ["sptf"],
            Permissions: ["ATTACH_FILES"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, guild, channel, author, args }, t) {
        const buffer = await this.client.canvas.templates.get(false, 'Spotify').then(({ run }) => run);
        const user = await this.GetUser(args, message, guild, author);

        if (!user.presence.game || user.presence.game && user.presence.game.type !== 2 || user.presence.game && user.presence.game.name !== 'Spotify' || user.presence.game.assets === null) {
            return channel.send(new ClientEmbed(author)
                .setDescription(`${Emojis.Errado} **${user.username}** ${t('comandos:spotify.notListening')}`)
                .setColor(process.env.ERROR_COLOR)
                
            )
        } else {
            const attachment = new Attachment(await buffer(user), `${user.username}_Spotify.png`);
            return channel.send(`\`${user.tag}\``, attachment);
        }
    }
}

module.exports = Spotify;