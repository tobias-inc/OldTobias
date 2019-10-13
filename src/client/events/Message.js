const { ClientEmbed, CommandContext, Emojis } = require("../../");
const Event = require("../../structures/Event.js");

const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const GetPrefix = (m, p) => p.find(pr => m.content.startsWith(pr));

module.exports = class MessageEvent extends Event {
    constructor(client) {
        super(client)
        this.client = client
        this.name = 'message'
    }

    async ON(message) {
        if ((!message.author.bot && message.guild) && message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES')) {
            if (message.channel.id == process.env.CHANNEL_SUGGESTS) return (() => {
                return message.react(Emojis.reactions.okay).then(() => message.react(Emojis.reactions.error));
            })()
        }
        if (!(
            this.client.database.guilds || this.client.database.users || this.client.database.comandos
        ) || message.author.bot) return;

        const { prefix, language } = (message.guild
            ? await this.client.database.guilds.get(message.guild.id)
            : {
                prefix: process.env.PREFIX,
                language: process.env.LANG_ROOT
            }
        );
        const Prefixes = [prefix, `<@!${this.client.user.id}>`, `<@${this.client.user.id}>`];
        const Prefix = GetPrefix(message, Prefixes);

        if (message.content.match(GetMention(this.client.user.id)) || Prefix) {
            const {
                contributor: { developer, owner, translater },
                blacklist,
                vip
            } = await this.client.database.users.get(message.author.id);

            if (message.content.match(GetMention(this.client.user.id)) && (!blacklist)) {
                return message.channel.send(new ClientEmbed(message.author)
                    .setDescription(`${Emojis.Certo} **${message.author.username}**, ` + this.client.language.i18next.getFixedT(language)('comandos:mentionBot', { prefix }))
                ).catch(() => { });
            }

            if (Prefix && (message.content.length > Prefix.length)) {
                const args = message.content.slice(Prefix.length).trim().split(/ +/g);
                const cmdInsert = args.shift();
                const command = this.client.commands.all.find(cmd => (
                    cmd.commandHelp.name.toLowerCase() === cmdInsert.toLowerCase()
                ) || (
                        cmd.commandHelp.aliases && cmd.commandHelp.aliases.includes(cmdInsert.toLowerCase())
                    )
                )

                if (command) {
                    const { aproved, because, other = 'none' } = await this.VerifyCommand({ blacklist, developer, owner, translater, vip: vip.active, author: message.author }, command);

                    if (!(aproved)) {
                        const support = await this.client.utils.get('links', 'support').then(({ redirect }) => redirect);
                        return (() => {
                            if (blacklist && because || because) {
                                message.channel.send(new ClientEmbed(message.author)
                                    .setDescription(`${Emojis.Errado} **${message.author.username}**, ${this.client.language.i18next.getFixedT(language)(because
                                        , {
                                            support,other
                                        })}`
                                    )
                                    .setColor(process.env.ERROR_COLOR)
                                ).catch(() => { });
                            }
                        })();
                    }

                    const settings = new CommandContext({
                        client: this.client,
                        aliase: cmdInsert,
                        usedPrefix: Prefix,
                        developer: (owner ? owner : developer ? developer : translater ? translater : false),
                        owner: owner,
                        command,
                        prefix,
                        message,
                        args,
                        language,
                    });

                    return command.commandHelp.verify(settings)
                        .then(() => {
                            command.commandHelp.coolDown(message.author)
                            return this.UserUtils(message.author)
                                .then(() => this.CommandUtils(command))
                        })
                        .catch(this.client.LOG_ERR);
                }
            }
        }
    }
}
