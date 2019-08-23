const { Command, Emojis, ClientEmbed } = require("../../");

const msgTimeOut = async (msg, time) => {
    await new Promise(function (resolve, reject) {
        setTimeout(resolve, time)
    })
    return msg.guild ? msg.clearReactions().catch(() => { }) : msg.delete();
}

class BotInfo extends Command {
    constructor(client) {
        super(client, {
            name: "botinfo",
            description: "Informações sobre o bot",
            usage: { args: false, argsNeed: false },
            category: "Bot",
            cooldown: 3000,
            aliases: ["bi", "boti"],
            Permissions: ["ADD_REACTIONS"], // MANAGE_MESSAGES
            UserPermissions: [],
            devNeed: false,
            needGuild: true
        });
    }

    async run({ author, channel, guild, language }, t) {
        const insertClient = (embed) => embed
            .setAuthor(this.client.user.username, this.client.user.displayAvatarURL)
            .setThumbnail(this.client.user.displayAvatarURL);

        const links = {
            support: await this.client.utils.get('links', 'support').then(({ redirect }) => redirect),
            invite: await this.client.utils.get('links', 'invite').then(({ redirect }) => redirect.replace(/{{userID}}/gi, this.client.user.id)),
            vote: await this.client.utils.get('links', 'vote').then(({ redirect }) => redirect.replace('{{userID}}', this.client.user.id)),
            vote1: await this.client.utils.get('links', 'vote1').then(({ redirect }) => redirect.replace('{{userID}}', this.client.user.id))
        }
        const embed = insertClient(await this.newInfo(author, language, links, t));

        return channel.send(embed).then(async (msg) => {
            await msg.react(Emojis.reactions.next);
            return ((N = 0) => {
                const initializeCollector = (msg.createReactionCollector(
                    (reaction, user) => [Emojis.reactions.back, Emojis.reactions.next].includes(reaction.emoji.id)
                        && user.id === author.id,
                    { time: 120000 })
                );

                msgTimeOut(msg, 120000);
                return initializeCollector.on('collect', async (r) => {
                    try {
                        if (guild && channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES")) await msg.clearReactions();
                        else r.remove(this.client.user.id);

                        if (N == 0) {
                            await msg.react(Emojis.reactions.back)
                            msg.edit(insertClient(await this.newEmbed(author, language, t)))
                        } else {
                            await msg.react(Emojis.reactions.next)
                            msg.edit(insertClient(await this.newInfo(author, language, links, t)))
                        }

                        return (N == 1 ? N = 0 : N = 1);
                    } catch (e) {
                        if (guild && channel.permissionsFor(this.client.user.id).has("MANAGE_MESSAGES")) await msg.clearReactions();
                        else r.remove(this.client.user.id);

                        msg.edit(embed.setColor(process.env.ERROR_COLOR));
                        return initializeCollector.stop();
                    }
                }).catch(() => { })
            })()
        }).catch(() => { })
    }

    async newInfo(author, language, { support, invite, vote,vote1 }, t) {
        return (new ClientEmbed(author)
            .addField(t('clientMessages:botinfo.stats.ctx'), (t('clientMessages:botinfo.stats.text'
                , {
                    usages: (await this.getCommandsUsages(language)),
                    guilds: (await this.getGuildsSize(language)),
                    users: (await this.getUsersSize(language))
                })
            ), false)
            .addField(t('clientMessages:botinfo.host.ctx'), (t('clientMessages:botinfo.host.text'
                , {
                    ram: (await this.getRamUsage()),
                    ping: (await this.getPing()),
                    version: process.version
                })
            ), false)
            .addField(t('clientMessages:botinfo.others.ctx'), (t('clientMessages:botinfo.others.text'
                , {
                    shard: (await this.getShard()),
                    uptime: (await this.getTime())
                })
            ), false)
            .addField(t('clientMessages:botinfo.links.ctx'), (t('clientMessages:botinfo.links.urls'
                , {
                    support, invite, vote, vote1
                })
            ), false)
        )
    }

    async newEmbed(author, language, t) {
        const { usedCommands } = await this.client.database.users.findOne(author.id)
        const servers = await this.client.ShardUtils.getSharedServers(author);

        return (new ClientEmbed(author)
            .addField(t('clientMessages:botinfo.usedCommands'), `**${Number(usedCommands).localeNumber(language)}**`, false)
            .addField(t('clientMessages:botinfo.sharedServers.ctx', { size: servers.length }), (servers.length && servers.length <= 5
                ? servers.map(g => `**${g}**`).join(' `||` ')
                : servers.length > 5
                    ? servers.map(g => `**${g}**`).slice(0, 5).join(' `||` ') + t('clientMessages:botinfo.sharedServers.more', {
                        size: (servers.length - 5)
                    })
                    : t('clientMessages:botinfo.sharedServers.none')
            ), false)
        )
    }
}

module.exports = BotInfo;