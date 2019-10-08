const {
    moment = require('moment'),
    Command, Emojis, ClientEmbed
} = require("../../");

class RoleInfo extends Command {
    constructor(client) {
        super(client, {
            name: "roleinfo",
            description: "Informações sobre um cargo",
            usage: { args: true, argsNeed: true, argsTxt: "<role [id, mention, name]>", need: "{prefix} {cmd} {args}" },
            category: "Information",
            cooldownTime: 3000,
            aliases: ["role", "ri"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ message, channel, guild, author, args, language }, t) {
        const EMBED = new ClientEmbed(author);
        const ROLE = (await this.getRole(args, message, guild));

        if (args[0] && ROLE) {
            (EMBED
                .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
                .setThumbnail('http://www.singlecolorimage.com/get/' + ROLE.hexColor.replace('#', '') + '/400x400'));

            return channel.send(EMBED
                .addField(t('clientMessages:roleinfo.name'), ROLE.name, true)
                .addField(t('clientMessages:roleinfo.id'), ROLE.id, true)
                .addField(t('clientMessages:roleinfo.createdAt'), (await this.Time(ROLE.createdAt, language)), false)
                .addField(t('clientMessages:roleinfo.position.ctx'), (`${t('clientMessages:roleinfo.position.get', { size: (guild.roles.size - 1), position: ROLE.calculatedPosition })}`), true)
                .addField(t('clientMessages:roleinfo.hoist.ctx'), t(`clientMessages:roleinfo.hoist.${ROLE.hoist}`), true)
                .addField(t('clientMessages:roleinfo.mentionable.ctx'), t(`clientMessages:roleinfo.mentionable.${ROLE.mentionable}`), true)
                .addField(t('clientMessages:roleinfo.hexColor'), ROLE.hexColor, true)
                .addField(t('clientMessages:roleinfo.members.ctx', { size: ROLE.members.size }), (await this.Members(ROLE, t)), false)
                .setColor(ROLE.hexColor)
            )
        } else {
            const ERROR = (args[0] ? 'comandos:roleinfo.noRole' : 'comandos:roleinfo.noArgs');
            return channel.send(EMBED
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t(ERROR, { searsh: args.join(' ') })}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }

    Members(role, t) {
        const MEMBERS = role.members;
        return (!MEMBERS.size
            ? t('clientMessages:roleinfo.members.none') : MEMBERS.size > 10
                ? MEMBERS.map(m => m).slice(0, 10).join(', ') + t('clientMessages:roleinfo.members.and', { size: (MEMBERS.size - 10) }) : MEMBERS.map(m => m).join(', ')
        )
    }

    Time(ms, language) {
        moment.locale(language);
        return moment(ms).format('LLLL');
    }
}

module.exports = RoleInfo;