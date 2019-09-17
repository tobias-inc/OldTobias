const {
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../../");

const msgTimeOut = async (msg, time) => {
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, time)
    })
    return msg.clearReactions().catch(() => { });
}

class UserInfo extends Command {
    constructor(client) {
        super(client, {
            name: "userinfo",
            description: "Informações sobre um usuário",
            usage: { args: true, argsNeed: false, argsTxt: "<user [id, mention, name]>", need: "{prefix} {cmd} {args}" },
            category: "Information",
            cooldown: 3000,
            aliases: ["useri", "ui"],
            Permissions: ["ADD_REACTIONS"], // MANAGE_MESSAGES
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args, language }, t, { displayAvatarURL } = this.client.user) {
        const USER = (await this.GetUser(args, message, guild, author, true));
        await this.client.database.users.verificar(USER.id) || await this.client.database.users.add({ _id: USER.id });
        const user = await this.client.database.users.findOne(USER.id)

        const EMBED = new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)
            .setThumbnail(USER.avatarURL ? USER.avatarURL : displayAvatarURL);
        let Status;
        if(USER.presence.status === "online") Status = Emojis.Online
        if(USER.presence.status === "dnd") Status = Emojis.Dnd
        if(USER.presence.status === "idle") Status = Emojis.Idle
        if(USER.presence.status === "offline") Status = Emojis.Offline
        if(USER.presence.status === "streaming") Status = Emojis.Streaming

        return channel.send(EMBED
            .addField(t('clientMessages:userinfo.name'),  `[**${USER.tag}**](${user.contributor.redirect })` ? `[**${USER.tag}**](${user.contributor.redirect })` : USER.tag , true)
            .addField(t('clientMessages:userinfo.nickname.ctx'), (!!guild.member(USER.id).nickname ? guild.member(USER.id).nickname : t('clientMessages:userinfo.nickname.none')), true)
            .addField(t('clientMessages:userinfo.id'), USER.id, false)
            .addField(t('clientMessages:userinfo.createdAt'), (await this.Time(USER.createdAt, language)), false)
            .addField(t('clientMessages:userinfo.joinedAt'), (await this.Time(guild.member(USER.id).joinedAt, language)), false)
            .addField(t('clientMessages:userinfo.status.ctx'),Status + t(`clientMessages:userinfo.status.${USER.presence.status}`), true)
            .addField(t('clientMessages:userinfo.bot.ctx'), t(`clientMessages:userinfo.bot.${USER.bot}`), true)
            .addField(t('clientMessages:userinfo.role.ctx', { size: Number((guild.member(USER.id).roles.size - 1)).localeNumber(language) }), (await this.Roles(USER, guild, t, language)), false)
        ).then((msg) => {
            msg.react(Emojis.reactions.next);
            return ((N = 0) => {
                const initializeCollector = msg.createReactionCollector((reaction, user) => (
                    (reaction.emoji.id === Emojis.reactions.back || reaction.emoji.id === Emojis.reactions.next) && (
                        user.id === author.id
                    )), { time: 120000 });

                msgTimeOut(msg, 120000);
                return initializeCollector.on('collect', async (r) => {
                    if (guild && channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES")) await msg.clearReactions();
                    else r.remove(this.client.user.id);

                    if (N == 0) {
                        this.newEmbed(msg, USER, author, channel, t).catch(() => { })
                        msg.react(Emojis.reactions.back)
                    } else {
                        msg.edit(EMBED).catch(() => { })
                        msg.react(Emojis.reactions.next)
                    }

                    return (N == 1 ? N = 0 : N = 1);
                }).catch(async () => {
                    if (guild && channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES")) await msg.clearReactions();
                    else r.remove(this.client.user.id);

                    msg.edit(EMBED.setColor(process.env.ERROR_COLOR));
                    return initializeCollector.stop();
                })
            })()
        }).catch(() => { });
    }

    Roles(user, guild, t, lang) {
        const ROLES = guild.member(user.id).roles.map(role => role).slice(1);
        if (!ROLES.length) return t('clientMessages:userinfo.role.none');
        return [
            (ROLES.length > 10
                ? ROLES.map(r => r).slice(0, 10).join(", ") + ` ${t('clientMessages:userinfo.role.and'
                    , {
                        size: Number(ROLES.length - 10).localeNumber(lang)
                    })}`
                : ROLES.map(r => r).join(", ")
            )
        ]
    }

    newEmbed(msg, user, author, channel, t, { displayAvatarURL } = this.client.user) {
        return msg.edit(new ClientEmbed(author)
            .setAuthor(this.client.user.username, displayAvatarURL)
            .setThumbnail(user.avatarURL ? user.avatarURL : displayAvatarURL)
            .addField(t('clientMessages:userinfo.permissions'), (channel.permissionsFor(user.id).toArray().map(perm => `\`${perm}\``).join(', ')))
        )
    }

    Time(ms, language) {
        moment.locale(language);
        return moment(ms).format('LLLL');
    }
}
module.exports = UserInfo;