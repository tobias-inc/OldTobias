const {
    Discord = require("discord.js"),
    superagent = require('superagent'),
    Command, ClientEmbed, Emojis
} = require("../../");

class pat extends Command {
    constructor(client) {
        super(client, {
            name: "pat",
            description: "Faz carinho em alguém",
            usage: { args: true, argsNeed: true, argsTxt: "<user>", need: "{prefix} {cmd} {args}" },
            category: "Fun",
            cooldown: 3000,
            aliases: ["carinho","cafune","cafuné"],
            Permissions: ["ATTACH_FILES"],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args}, t, { displayAvatarURL } = this.client.user) {
        const USER = (await this.GetUser(args[0],message,guild));
        const {body} = await superagent
        .get(`https://nekos.life/api/v2/img/pat`);

        const EMBED = new ClientEmbed(author)
        .setAuthor(this.client.user.username, displayAvatarURL)

        if(!USER){
            return channel.send(EMBED
                .setDescription(`${Emojis.Errado} | **${author.username}**  ${t('comandos:pat.noArgs')}`)
                .setColor(process.env.ERROR_COLOR)
            )
        };

        if(USER === message.author) return channel.send(`${Emojis.Errado} | ${t(`comandos:pat.patyourself`,{ USER: message.author })} `);
        if(USER === this.client.user) return channel.send(`${Emojis.Triste} | ${t(`comandos:pat.Client`)}`) 

        return channel.send(EMBED
        .setDescription(`${Emojis.Love} | ${message.author} ${t(`clientMessages:Pat`)} ${USER}`)
        .setImage(body.url)
        .setColor(process.env.COLOR_EMBED)
        )
    }
}
module.exports = pat;