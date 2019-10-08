const {
    moment = require('moment'),
    Command, Emojis, ClientEmbed, ErrorCommand
} = require("../../");

class ChannelInfo extends Command {
    constructor(client) {
        super(client, {
            name: "channelinfo",
            description: "Informações sobre um cargo",
            usage: { args: true, argsNeed: false, argsTxt: "<role [id, mention, name]>", need: "{prefix} {cmd} {args}" },
            category: "Information",
            cooldownTime: 3000,
            aliases: ["channeli", "ci"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args, language }, t, { displayAvatarURL } = this.client.user) {
        const CHANNEL = await this.GetChannel(args, message, guild, channel);
        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)
            .setThumbnail(guild.iconURL ? guild.iconURL : displayAvatarURL);
            
        let POSICAO = CHANNEL.position + 1
        if (CHANNEL) {
            return channel.send(EMBED
                .addField(t('clientMessages:channelinfo.type.ctx'), t(`clientMessages:channelinfo.type.${CHANNEL.type}`), true)
                .addField(t('clientMessages:channelinfo.name'), CHANNEL.name, true)
                .addField(t('clientMessages:channelinfo.id'), CHANNEL.id, true)
                .addField(t('clientMessages:channelinfo.position'), POSICAO, true)
                .addField(t('clientMessages:channelinfo.topic.ctx'), (await this.Topic(CHANNEL, t)), false)
                .addField(t('clientMessages:channelinfo.createdAt'), (await this.Time(CHANNEL.createdAt, language)), false)
                .addField(t('clientMessages:channelinfo.nfsw',message.channel.nsfw ? 'clientMessages:channelinfo.nfswTrue' : "clientMessages:channelinfo.nfswFalse"))
            );
        } else {
            throw new ErrorCommand(t('errors:noSpecified'));
        }
    }

    Topic(channel, t) {
        if (channel.type === 'text') {
            return (channel.topic ? channel.topic : t('clientMessages:channelinfo.topic.noTopic'))
        } else {
            return t('clientMessages:channelinfo.topic.topicImpossible')
        }
    }

    Time(ms, language) {
        moment.locale(language);
        return moment(ms).format('LLLL');
    }
}

module.exports = ChannelInfo;