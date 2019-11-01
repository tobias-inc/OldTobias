const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class Novidades extends Command {
    constructor(client) {
        super(client, {
            name: "Novidades",
            description: "",
            usage: { args: true, argsNeed: true, argsTxt: "<option> <command>", need: "{prefix} {cmd} {args}" },
            category: "Developer",
            cooldownTime: 3000,
            aliases: ["Novas", "novi"],
            Permissions: [],
            UserPermissions: [],
            ownerNeed: true,
            needGuild: false
        });
    }

    async run( {message, channel, guild, author, args}, t, { displayAvatarURL } = this.client.user) {
        const CHANNEL = await this.GetChannel(args, message, guild, channel);
        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)
            .setThumbnail(guild.iconURL ? guild.iconURL : displayAvatarURL);
        const NOVIDS = args.slice(1).join(" ") 

        CHANNEL.send(EMBED
                .setTitle(`${Emojis.Love} Novidades no Tobias de Chapéu ${Emojis.Love}`)
                .addField(Emojis.Popcorn ,NOVIDS)
        )
        return  CHANNEL.send("@<557555132645244958>").then(e => e.delete())
    }
}

    module.exports = Novidades;