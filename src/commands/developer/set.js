const { Command, Emojis, ClientEmbed, ErrorCommand } = require("../../");

class SetRole extends Command {
    constructor(client) {
        super(client, {
            name: "set",
            description: "Seta um cargo ao usuário inserido",
            usage: { args: true, argsNeed: true, argsTxt: "<parameter> <user>", need: "{prefix} {cmd} {args}" },
            category: "Developer",
            cooldown: 3000,
            aliases: ["setar"],
            Permissions: [],
            UserPermissions: [],
            ownerNeed: true,
            needGuild: true
        });
    }

    async run({ message, channel, author, guild, args }, t) {
        const embed = new ClientEmbed(author);
        const user = await this.GetUser(args.slice(1), message, guild, author);
        const userDoc = await this.client.database.users.get(user.id)

        if (args[0] && args[1] && userDoc && (userDoc._id !== author.id)) {
            const aliase = await this.GET_ALIASE(args[0]);
            if (aliase) {
                let set = (userDoc.contributor[aliase.type] !== undefined
                    ? userDoc.contributor[aliase.type]
                    : userDoc[aliase.type]
                ) ? false : true;
                let send = (aliase.danger ? `comandos:set.${set ? 'banTo' : 'unBanTo'}` : `comandos:set.${set ? 'setTo' : 'unSetTo'}`);

                await this.client.DatabaseUtils['set' + aliase.type.charAt(0).toUpperCase() + aliase.type.slice(1)](user, set)
                    .catch((err) => { throw new ErrorCommand(err) });

                return channel.send(embed
                    .setDescription(`${Emojis.Certo} **${author.username}**, ${t(`${send}`, { user: user.username, type: aliase.type })}`)
                )
            } else {
                return channel.send(embed
                    .setDescription(`${Emojis.Errado} **${author.username}**, ${t('comandos:set.noAliaseContent', { parameters: (await this.GET_PARAMETERS()) })}`)
                    .setColor(process.env.ERROR_COLOR)
                )
            }
        } else {
            const error = (!args[0]
                ? 'comandos:set.noParameters' : !(await this.GET_ALIASE(args[0]))
                    ? 'comandos:set.noAliaseContent' : !args[1]
                        ? 'comandos:set.noUserIdentify' : !userDoc
                            ? 'comandos:set.noUserDb' : (user.id === author.id)
                                ? 'comandos:set.noUserIdentify' : 'comandos:set.noParameters'
            )

            return channel.send(embed
                .setDescription(`${Emojis.Errado} **${author.username}**, ${t(error, { user: user.username, parameters: (await this.GET_PARAMETERS()) })}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }
    }

    GET_PARAMETERS() {
        return '[' + this.client.Aliases['set'].map(parameter => (
            `${parameter.aliase.map(a => a).slice(0, 1)}`
        )).join(' | ') + ']'
    }

    async GET_ALIASE(msg) {
        return await this.client.Aliases['set'].find(get => get.aliase.includes(msg.toLowerCase()));
    }
}

module.exports = SetRole;