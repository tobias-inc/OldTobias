const { Command, ClientEmbed } = require("../../../");

class NotifierVip extends Command {
    constructor(client) {
        super(client, {
            name: "notifier",
            description: "",
            usage: { args: false, argsNeed: false },
            category: "Vip",
            aliases: ["notificar"],
            referenceCommand: 'vip',
            Permissions: [],
            UserPermissions: []
        }, true);
    }

    async run(author, channel, t) {
        const { vip } = await this.client.database.users.findOne(author.id);
        const returnt = vip.notifier ? false : true;

        await this.client.database.users.update(author.id, { $set: { 'vip.notifier': returnt } });
        return channel.send(new ClientEmbed(author)
            .setDescription(t(`comandos:vip.notifier.${returnt}`))
        )
    }
}

module.exports = NotifierVip;