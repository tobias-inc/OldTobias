const {
    Discord = require('discord.js'),
    Command, Emojis
} = require("../..");

class Dell extends Command {
    constructor(client) {
        super(client, {
            name: "dell",
            description: "deleta mensagens em massa",
            usage: { args: true, argsNeed: true, argsTxt: "<quantidade>", need: "{prefix} {cmd} {args}" },
            category: "Moderation",
            cooldown: 3000,
            aliases: ["deletar","apagar"],
            Permissions: ["MANAGE_MESSAGES"],
            UserPermissions: ["MANAGE_MESSAGES"],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, author}, t) {
        let parts = message.content.split(' ');
        let toDeleteCount = parseInt(parts[1]);

                    if (parts.length > 1 && parts.length < 3) {
                        if (isNaN(toDeleteCount) === false) {
                            if(toDeleteCount <= 100) {
                                channel.bulkDelete(toDeleteCount + 1, true)
                                channel.send(`${Emojis.Popcorn} | ${t('clientMessages:Dell',{USER: author.tag, COUNT: toDeleteCount})}`).then(message => {
                                    setTimeout(() => {message.delete()}, 5000)
                                })
    
                            } else {
                                channel.send(`${Emojis.Errado} | ${t('comandos:dell.maxLen')}`).then(message => {
                                    setTimeout(() => {message.delete()}, 5000)
                                })
                            }
                        } else {
                            channel.send(`${Emojis.Errado} | ${t('comandos:dell.noNum',{PARTS:parts[0]})}`).then(message => {
                                setTimeout(() => {message.delete()}, 5000)
                                })
                        }
                    } else {
                        channel.send(`${Emojis.Errado} | ${t('comandos:dell.noArgs',{PARTS:parts[0]})}`).then(message => {
                                    setTimeout(() => {message.delete()}, 5000)
            })
        }

    }
}
module.exports = Dell;