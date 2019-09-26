const { Command, Emojis, ClientEmbed } = require("../../");
const moment = require("moment");

require("moment-duration-format");

const vipUtils = {
    'BPD': 28800000,
    'DBL': 43200000
}

class Vip extends Command {
    constructor(client) {
        super(client, {
            name: "vip",
            description: "Informações sobre o seu acesso vip",
            usage: { args: true, argsNeed: false, argsTxt: "[subcommand]", need: "{prefix} {cmd} {args}" },
            category: "Vip",
            cooldown: 3000,
            aliases: [],
            Permissions: [],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ message, args, author, channel, guild, language, prefix }, t) {
        const subcommand = args[0] && this.client.commands.subcommands.get(this.category).find(
            cmd => cmd.name.toLowerCase() === args[0].toLowerCase() || cmd.aliases.includes(args[0].toLowerCase())
        )
        if (subcommand) return subcommand.run(author, channel, t);

        moment.locale(language);
        const user = (await this.GetUser(args, message, guild, author, true));
        await this.client.database.users.verificar(user.id) || await this.client.database.users.add({ _id: user.id });

        const { vipActive, vipHours } = {
            vipActive: await this.client.database.users.findOne(user.id).then(u => u.vip),
            vipHours: await this.client.database.users.findOne(user.id).then((u) => {
                let msGet = 0
                const keys = Object.keys(u.votes);
                for (let key of keys) u.votes[key].active ? msGet += (vipUtils[key] - parseInt((new Date() - u.votes[key].date))) : '';
                return msGet;
            })
        }
        const embed = (new ClientEmbed(author).addField(t('comandos:vip.active.ctx')
            , `**${t(`comandos:vip.active.${vipActive.active}`)}**`, false)
        );

        if (vipActive.active) embed.addField(t('comandos:vip.temp')
            , `**\`${moment.duration(vipHours, 'milliseconds').format('hh:mm:ss', { stopTrim: 'm' })}\`**`);
        else embed.addField(t('comandos:vip.getActiveInfo.ctx'), t('comandos:vip.getActiveInfo.type'
            , {
                vote: await this.client.utils.get('links', 'vote').then(({ redirect }) => { return redirect.replace('{{userID}}', this.client.user.id) }),
                vote1: await this.client.utils.get('links', 'vote1').then(({ redirect }) => { return redirect.replace('{{userID}}', this.client.user.id) })
            }));
        return channel.send(embed
            .setTitle(`${Emojis.Vip} | ${t('comandos:vip.infoTitle', { user: user.username })}`, { user: user.tag })
            .setThumbnail(user.displayAvatarURL || this.client.user.displayAvatarURL)
            .addField(t('comandos:vip.dmNotifier.ctx'), t('comandos:vip.dmNotifier.usage'
                , {
                    prefix,
                    name: this.name
                })
            )
        )
    }
}

module.exports = Vip;