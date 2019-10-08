const {
    weather = require("weather-js"),
    Command, Emojis, ClientEmbed
} = require("../../");

class Wheater extends Command {
    constructor(client) {
        super(client, {
            name: "weather",
            description: "Mostra as informações climaticas sobre um lugar",
            usage: { args: true, argsNeed: false, argsTxt: "place", need: "{prefix} {cmd} {args}" },
            category: "Information",
            cooldownTime: 3000,
            aliases: ["clima", "tempo", "wheater", "wheather"],
            Permissions: [], // MANAGE_MESSAGES
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ channel, args, client , guild, author}, t, { displayAvatarURL } = this.client.user) {

            if (!args[0]) return channel.send(t("errors:noArgs"));

            let servidorlokão = await this.client.database.guilds.get(guild.id);

        weather.find({ search: args.join(' '), degreeType: 'C', lang: servidorlokão.language }, function (err, result) {

            if (err === undefined) return channel.send(t("errors:404"));

            var curent = result[0].current;
            var location = result[0].location;

            const EMBED = new ClientEmbed(author)
                .setAuthor(client.user.username, displayAvatarURL)
                .setThumbnail(curent.imageUrl);

            
            return channel.send(EMBED
                .setDescription(t('clientMessages:Weather.description', { place: curent.observationpoint }))
                .addField(t('clientMessages:Weather.timezone'), `UTC${location.timezone}`, true)
                .addField(t('clientMessages:Weather.currenttemp'), `${curent.temperature} ºC`, true)
                .addField(t('clientMessages:Weather.feelslike'), `${curent.feelslike}ºC `, false)
                .addField(t('clientMessages:Weather.wind'), curent.winddisplay, true)
                .addField(t('clientMessages:Weather.humidity'), `${curent.humidity}%`, true)
                .addField(t('clientMessages:Weather.day'), curent.day, true)
            )
        })
    }
}
module.exports = Wheater;