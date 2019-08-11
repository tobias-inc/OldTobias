const {
    Discord = require("discord.js"),
    superagent = require('superagent'),
    Command, ClientEmbed, Emojis
} = require("../../");

class Tapa extends Command {
    constructor(client) {
        super(client, {
            name: "tapa",
            description: "Dá um tapa em um usuário",
            usage: { args: true, argsNeed: true, argsTxt: "<user>", need: "{prefix} {cmd} {args}" },
            category: "Fun",
            cooldown: 3000,
            aliases: ["slap","tapão"],
            Permissions: ["ATTACH_FILES"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args}, t, { displayAvatarURL } = this.client.user) {
        const USER = (await this.GetUser(args[0],message,guild));
        const {body} = await superagent
        .get(`https://nekos.life/api/v2/img/slap`);

        const EMBED = new ClientEmbed(author)
        .setAuthor(this.client.user.username, displayAvatarURL)

        if(!USER){
            return channel.send(EMBED
                .setDescription(`${Emojis.Errado} | **${author.username}**  ${t('comandos:tapa.noArgs')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        };

        if(USER === message.author) return channel.send(`${Emojis.Errado} | ${t(`comandos:tapa.slapyourself`)} `);
        if(USER === this.client.user) return channel.send(`${Emojis.Puto} | ${t(`ctapa.Client`)}`) 

        return channel.send(EMBED
        .setDescription(`${Emojis.Popcorn} | ${message.author} ${t(`clientMessages:Tapa.slaped`)} ${USER}`)
        .setImage(body.url)
        .setColor(process.env.COLOR_EMBED)
        )
    }
}
module.exports = Tapa;