const { Emojis, ClientEmbed } = require("../../");
const VotesUtils = require("../VotesUtils.js");
const fetch = require('node-fetch');

module.exports = class BotListEvent extends VotesUtils {
    constructor(client) {
        super(client);
        this.client = client
        this.name = 'botlistevent'
    }

    async ON() {
        const UpdateInfo = async () => this.UpdateInfos();
        const run = () => setTimeout(UpdateInfo, (15 * 60000));
        UpdateInfo();
        run();
        return this.on();
    }

    async UpdateInfos() {
        const guilds = await this.client.ShardUtils.getGuildsSize();
        fetch(`https://api.botsparadiscord.xyz/bots/${this.client.user.id}/info?guilds=${guilds}`, {
            method: 'POST',
            headers: {
                Authorization: process.env.BPD_TOKEN
            }
        }).then(() => this.client.LOG('Informations updated successfully', 'BotsPraDiscord'));

        return this.client.dbl.postStats(this.client.guilds.size, this.client.shard.id, this.client.shard.count)
            .then(() => this.client.LOG('Informations updated successfully', 'DiscordBotList'));
    }

    async send(vipMethod, ...args) {
        if (vipMethod) {
            const { method, settings, user, msg, send, t } = args[0];
            const embed = new ClientEmbed(this.client.user);
            if (method == 'unvip') embed.setColor(process.env.ERROR_COLOR);
            const logTitle = method == 'unvip' ? 'Vip Retirado' : 'Vip Adicionado';
            const GuiLdA = this.client.guilds.get(process.env.GUILD_ID)

            if (send) {
                switch (method) {
                    case 'vip':
                        user.send(new ClientEmbed(user)
                            .setDescription(`${Emojis.Vip} | **${user.username}** ${t(msg, {
                                hours: Object.values(settings.map(res => res.vipHours.h)).reduce((a, b) => a + b, 0),
                                dbl: settings.map(res => `[${res.name}](${res.url})`).join(', ')
                            })}`)
                            .setFooter(t('clientMessages:footer.team', { user: this.client.user.username }), this.client.user.displayAvatarURL)
                            .setAuthor(user.username, user.displayAvatarURL)
                            .setColor(process.env.COLOR_EMBED)
                        ).catch(() => { });
                        if (GuiLdA.members.get(user)) {
                            GuiLdA.members.get(user).addRole(process.env.VIP_ID)
                        } else { }
                        break;
                    case 'unvip':
                        user.send(new ClientEmbed(user)
                            .setDescription(`${Emojis.Vip} | **${user.username}** ${t(msg, {
                                dbl: settings.map(res => `[${res.name}](${res.url})`).join(', ')
                            })}`)
                            .setFooter(t('clientMessages:footer.team', { user: this.client.user.username }), this.client.user.displayAvatarURL)
                            .setAuthor(user.username, user.displayAvatarURL)
                            .setColor(process.env.ERROR_COLOR)
                        ).catch(() => { });
                        if (GuiLdA.members.get(user)) {
                            GuiLdA.members.get(user).removeRole(process.env.VIP_ID)
                        } else { }
                        break;
                }
            }

            return this.client.ShardUtils.send(process.env.GUILD_ID, (JSON.parse(process.env.UTILS_LOGS)['VIP'])
                , embed
                    .setAuthor(logTitle, (user.displayAvatarURL || this.client.user.displayAvatarURL))
                    .setThumbnail((user.displayAvatarURL || this.client.user.displayAvatarURL))
                    .addField('Usuário', `${user.tag} \`(${user.id})\``, false)
                    .addField('DBL(s)', settings.map(res => res.name).join(', '), false)
            )
        } else { }
    }
}