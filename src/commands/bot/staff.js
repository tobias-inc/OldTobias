const { Command, Emojis, ClientEmbed } = require("../../");

class Staff extends Command {
    constructor(client) {
        super(client, {
            name: "staff",
            description: "Envolvidos em minha criação",
            usage: { args: false, argsNeed: false },
            category: "Bot",
            cooldownTime: 3000,
            aliases: ["stf"],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ author, channel }, t) {
        const embed = new ClientEmbed(author)
            .setAuthor(`${this.client.user.username} Staff`, this.client.user.displayAvatarURL)
            .setThumbnail(this.client.user.displayAvatarURL);

        const staffs = await this.client.database.users.findAll();
        const owners = [];
        const developers = [];
        const translaters = [];
        const designers = [];

        await this.push(staffs, owners, developers, translaters, designers);

        return channel.send(embed
            .addField(t('clientMessages:staff.owner'), (`${owners.length > 0
                ? owners.map(u => `[**${u.user.tag}**](${u.link})`).join(' `||` ')
                : t('clientMessages:staff.none')}`), false)
            .addField(t('clientMessages:staff.dev'), (`${developers.length > 0
                ? developers.map(u => `[**${u.user.tag}**](${u.link})`).join(' `||` ')
                : t('clientMessages:staff.none')}`), false)
            .addField(t('clientMessages:staff.transl'), (`${translaters.length > 0
                ? translaters.map(u => `[**${u.user.tag}**](${u.link})`).join(' `||` ')
                : t('clientMessages:staff.none')}`), false)
            .addField(t('clientMessages:staff.dzn'), (`${designers.length > 0
                ? designers.map(u => `[**${u.user.tag}**](${u.link})`).join(' `||` ')
                : t('clientMessages:staff.none')}`), false)
        )
    }

    async push(staffs, owners, developers, translaters, designers) {
        for (const owner of staffs.filter(user => user.contributor.owner)) {
            owners.push({ user: await this.client.fetchUser(owner._id).then(user => { return user }), link: owner.contributor.redirect })
        }
        for (const developer of staffs.filter(user => user.contributor.developer)) {
            developers.push({ user: await this.client.fetchUser(developer._id).then(user => { return user }), link: developer.contributor.redirect })
        }
        for (const translater of staffs.filter(user => user.contributor.translater)) {
            translaters.push({ user: await this.client.fetchUser(translater._id).then(user => { return user }), link: translater.contributor.redirect })
        }
        for (const designer of staffs.filter(user => user.contributor.designer)) {
            designers.push({ user: await this.client.fetchUser(designer._id).then(user => { return user }), link: designer.contributor.redirect })
        }
    }
}

module.exports = Staff;