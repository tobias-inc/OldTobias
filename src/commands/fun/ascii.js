const {
    figlet = require('figlet'),
    Command, Emojis
} = require("../../");

class Ascii extends Command {
    constructor(client) {
        super(client, {
            name: "ascii",
            description: "Forma um texto no padrão ascii",
            usage: { args: true, argsNeed: false, argsTxt: "<text>", need: "{prefix} {cmd} {args}" },
            category: "Fun",
            cooldownTime: 3000,
            aliases: ["asci"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ message, args, channel}, t) {

        let argsJunto = message.content.split(" ").slice(1).join(' ')
          var maxLen = 13    

          if(message.content === ".I."|| ".i.")return;
          if(argsJunto.length > maxLen) return channel.send(`${Emojis.Errado} |` + t('comandos:ascii.maxLen'))      
          if(!args[0])  return channel.send(`${Emojis.Errado} |` + t('comandos:ascii.noArgs')) 

          figlet(`${argsJunto}`, function(err, data) {
              channel.send(data);
              console.log(err || data)
        })
    }
}
module.exports = Ascii;
