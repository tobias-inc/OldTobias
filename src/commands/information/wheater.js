const {
    weather = require("weather-js"),
    Command, Emojis, ClientEmbed
} = require("../../");

class Wheater extends Command {
    constructor(client) {
        super(client, {
            name: "weather",
            description: "Informações climaticas sobre um lugar",
            usage: { args: true, argsNeed: false, argsTxt: "place", need: "{prefix} {cmd} {args}" },
            category: "Information",
            cooldown: 3000,
            aliases: ["clima", "tempo", "wheater", "wheather"],
            Permissions: [], // MANAGE_MESSAGES
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ author, channel, args, client }, t, { displayAvatarURL } = this.client.user) {
        weather.find({ search: args[0], degreeType: 'C', lang: 'pt-BR' }, function (err, result) {

            var curent = result[0].current;
            var location = result[0].location;

            if (err) return channel.send(t("errors:noArgs"));
            if (result.length = 0) return channel.send(t("errors:404"));

            const EMBED = new ClientEmbed(client)
                .setAuthor(client.user.username, displayAvatarURL)
                .setThumbnail(curent.imageUrl);

            return channel.send(EMBED
                .setDescription(t('clientMessages:Weather.description', { place: curent.name }))
                .addField(t('clientMessages:Weather.timezone'), `UTC${location.timezone}`, true)
                .addField(t('clientMessages:Weather.currenttemp'), `${curent.temperature} ºC`, true)
                .addField(t('clientMessages:Weather.feelslike'), `${curent.feelslike}ºC `, false)
                .addField(t('clientMessages:Weather.wind'), curent.winddisplay, true)
                .addField(t('clientMessages:Weather.humidity'), curent.humidity, true)
                .addField(t('clientMessages:Weather.day'), curent.day, true)
            )
        })
    }
}
module.exports = Wheater;