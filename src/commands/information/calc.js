const {
    Discord = require("discord.js"),
    math = require('mathjs'),
    Command,ClientEmbed
} = require("../../");

class Calc extends Command {
    constructor(client) {
        super(client, {
            name: "Calc",
            description: "Realiza uma operação aritmetrica",
            usage: { args: true, argsNeed: false, argsTxt: "<user>", need: "{prefix} {cmd} {args}" },
            category: "Information",
            cooldown: 3000,
            aliases: ["math","calcular", "calculate","calculadora"],
            Permissions: ["ATTACH_FILES"],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ message, author, args ,channel}, t, { displayAvatarURL } = this.client.user) {

        const EMBED = new ClientEmbed(author)
        .setAuthor(this.client.user.username, displayAvatarURL)

        const question = args.join(" ");
        if (!question) {
            message.reply(t("comandos:calc.noArgs"));
            return;
        }
        let answer;
        try {
            answer = math.eval(question);
        } catch (err) {
            return message.reply(t("comandos:calc.error"));
        }
        return channel.send(EMBED
            .setThumbnail("https://cdn.discordapp.com/attachments/513130436780752896/539028206548942869/Calculator_5122x.png")
            .setColor(process.env.COLOR_EMBED)
            .addField(t("comandos:calc.question"), question, true)
            .addField(t("comandos:calc.answer"), answer)
        ) 
    }

}
module.exports = Calc;