const {
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../../");

class ServerInfo extends Command {
    constructor(client) {
        super(client, {
            name: "serverinfo",
            description: "Informações sobre o servidor",
            usage: { args: false, argsNeed: false },
            category: "Information",
            cooldown: 3000,
            aliases: ["sinfo", "svi"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ channel, guild, author, language }, t, { displayAvatarURL } = this.client.user) {
        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)
            .setThumbnail(guild.iconURL ? guild.iconURL : displayAvatarURL);

        return channel.send(EMBED
            .addField(t('clientMessages:serverinfo.name'), guild.name, true)
            .addField(t('clientMessages:serverinfo.verify.ctx'), t(`clientMessages:serverinfo.verify.level.${guild.verificationLevel}`), true)
            .addField(t('clientMessages:serverinfo.createdAt'), (await this.Time(guild.createdAt, language)), false)
            .addField(t('clientMessages:serverinfo.owner'), guild.owner.user.tag, true)
            .addField(t('clientMessages:serverinfo.region'), this.client.regionsLang.replaces[guild.region], true)
            .addField(t('clientMessages:serverinfo.channels.ctx', { length: Number(guild.channels.size).localeNumber(language) }), (await this.Channels(guild, t, language)), true)
            .addField(t('clientMessages:serverinfo.members.ctx', { size: Number(guild.memberCount).localeNumber(language) }), (await this.Members(guild, t, language)), true)
            .addField(t('clientMessages:serverinfo.role.ctx', { length: Number(guild.roles.size - 1).localeNumber(language) }), (await this.Roles(guild, t, language)), false)
        )
    }

    Channels(guild, t, lang) {
        const CATEGORY = (`**${Number(guild.channels.filter(c => c.type === 'category').size).localeNumber(lang)}**`);
        const VOICE = (`**${Number(guild.channels.filter(c => c.type === 'voice').size).localeNumber(lang)}**`);
        const TEXT = (`**${Number(guild.channels.filter(c => c.type === 'text').size).localeNumber(lang)}**`);
        return [
            t('clientMessages:serverinfo.channels.category') + CATEGORY,
            t('clientMessages:serverinfo.channels.text') + TEXT,
            t('clientMessages:serverinfo.channels.voice') + VOICE
        ].join('\n');
    }

    Members(guild, t, lang) {
        const USERS = (`**${Number(guild.memberCount - guild.members.filter(u => u.user.bot).size).localeNumber(lang)}**`);
        const BOTS = (`**${Number(guild.members.filter(u => u.user.bot).size).localeNumber(lang)}**`);
        return [
            t('clientMessages:serverinfo.members.users') + USERS,
            t('clientMessages:serverinfo.members.bots') + BOTS
        ].join('\n');
    }

    Roles(guild, t, lang) {
        const ROLES = guild.roles.map(role => role).slice(1);
        const MANAGED = guild.roles.filter(role => role.managed);
        if (!ROLES.length) return t('clientMessages:serverinfo.role.noTags');
        return [
            t('clientMessages:serverinfo.role.managed') + `**${Number(MANAGED.size).localeNumber(lang)}**`,
            (ROLES.length > 10
                ? ROLES.map(r => r).slice(0, 10).join(", ") + ` ${t('clientMessages:serverinfo.role.tags', { length: (ROLES.length - 10) })}`
                : ROLES.map(r => r).join(", ")
            )
        ].join('\n');
    }

    Time(ms, language) {
        moment.locale(language);
        return moment(ms).format('LLLL');
    }
}

module.exports = ServerInfo;