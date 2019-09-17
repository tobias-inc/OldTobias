const {
    Discord = require("discord.js"),
    Attachment = Discord.Attachment,
    Command
} = require("../../");

class ServerIcon extends Command {
    constructor(client) {
        super(client, {
            name: "servericon",
            description: "Mostra o icone de um servidor",
            usage: { args: false, argsNeed: false },
            category: "Information",
            cooldown: 3000,
            aliases: ["sicon", "svicon"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({args,channel,guild}) {

        const GUILD = args[0] || guild

    if(!guild.iconURL)return channel.send(t("comandos:servericon",{guild:GUILD}));

        let hm = new Attachment(`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.gif`, `${GUILD.name}.gif`);
    return channel.send(`\`${GUILD.name}\`` , hm).catch(e => {
            hm = new Attachment(`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`, `${GUILD.name}.png`);
    channel.send(`\`${GUILD.name}\`` , hm) });
    }
}
module.exports = ServerIcon;