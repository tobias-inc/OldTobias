const { Command, Emojis, ErrorCommand } = require("../../");
const figlet = require('figlet');

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

  async run({ message, args, channel }, t) {
    const ascii = args.join(' ');
    
    if (!args[0]) return channel.send(`${Emojis.Errado} | ${t('comandos:ascii.noArgs')}`);
    
    if (ascii.length > 26) return channel.send(`${Emojis.Errado} | ${t('comandos:ascii.maxLen')}`);
  
    return figlet(ascii, function (err, data) {
      if (err) {
        throw new ErrorCommand('bota o erro aq async seu lixo')
      } else {
        return channel.send(`\`\`\`${data}\`\`\``);
      }
    })
  }
}

module.exports = Ascii;
