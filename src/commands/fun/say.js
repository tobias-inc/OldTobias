const {
    Discord = require("discord.js"),
    Command, Emojis
} = require("../../");

class Say extends Command {
    constructor(client) {
        super(client, {
            name: "say",
            description: "Repete os seus argumentos",
            usage: { args: true, argsNeed: true, argsTxt: "<text>", need: "{prefix} {cmd} {args}" },
            category: "Fun",
            cooldown: 3000,
            aliases: ["speak", "falar", "sai"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ message, channel}, t, ) {


let argsJunto = message.content.split(" ").slice(1).join(' ')

if (!argsJunto) return channel.send(`${Emojis.Errado} |` + t('comandos:say'))
if(argsJunto === "@everyone") return;
if(!message.guild.member(this.client.user).hasPermission("MANAGE_MESSAGES")){
  return message.reply(t('clientMessages:Say') + "\n" + argsJunto);
}
channel.send(`${argsJunto}`) 
    }
}
module.exports = Say;