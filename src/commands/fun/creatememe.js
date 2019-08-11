const {
    Discord = require("discord.js"),
    Attachment = Discord.Attachment,
    Command, ClientEmbed, Emojis, ErrorCommand, CanvasTemplates
} = require("../../");

const memes = CanvasTemplates.utils;

const getResponse = async (msg, channel, user, length) => {
    let response = {
        content: ''
    }

    await channel.awaitMessages(msg => msg.author.id === user.id, {
        max: 1,
        time: 60000,
        errors: ['time']
    }).then((res) => {
        const content = res.first().content
        res.first().delete().catch(() => { });
        if (content.length <= length) {
            response.content = content.trim().split('\n').join(' ');
            msg.delete()
        } else {
            throw new Error(`length.${length}`);
        }
    }).catch((e) => {
        e = e.message && e.message.includes('length') ? e.message : 'time.'
        msg.delete();
        throw new Error(e);
    });

    return response;
}

class CreateMeme extends Command {
    constructor(client) {
        super(client, {
            name: "creatememe",
            description: "Cria um meme escolhido pelo usuário",
            usage: { args: false, argsNeed: false },
            category: "Fun",
            cooldown: 3000,
            aliases: ["criarmeme", "crmeme", "memecreate", "c-meme", "criar-meme", "create-meme", "cmeme"],
            Permissions: ["ATTACH_FILES"], // MANAGE_MESSAGES
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run(settings, t, { channel, author } = settings) {
        const support = await this.client.utils.get('links', 'support')
            .then(({ redirect }) => { return redirect });

        const embed = new ClientEmbed(author);
        const result = await this.getTemplate(settings, t);

        if (!result.get) {
            if (!result.errorMsg) throw new ErrorCommand(t('errors:noSpecified'));
            return channel.send(embed
                .setDescription(`${Emojis.Build} **${author.username}** ${t(`comandos:creatememe.${result.errorMsg}`, {
                    support,
                    size: 8
                })}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }

        const texts = {};
        const template = result.template;

        try {
            for (let i = 0; i < template.loop; i++) {
                const msg = await channel.send(embed
                    .setDescription(`${Emojis.Build} **${author.username}** ${t(`comandos:creatememe.inserText`, {
                        i: i + 1,
                        carac: template.texts[i + 1]
                    })}`)
                )
                const text = await getResponse(msg, channel, author, template.texts[i + 1]);
                texts[i] = text
            }
        } catch (e) {
            e = e.message.split('.')
            let errorMsg = ''
            let length = ''

            switch (e[0]) {
                case 'time':
                    errorMsg = 'timeOut'
                    break;
                case 'length':
                    errorMsg = 'surpassedLength'
                    length = e[1]
                    break;
            }

            return channel.send(embed
                .setDescription(`${Emojis.Build} **${author.username}** ${t(`comandos:creatememe.${errorMsg}`, {
                    length
                })}`)
                .setColor(process.env.ERROR_COLOR)
            )
        }

        channel.startTyping()
        const memeImg = new Attachment(await template.run(texts, author), `${template.name}.png`);
        return channel.send(memeImg).then(() => channel.stopTyping()).catch(() => channel.startTyping());
    }

    async getTemplate({ channel, author }, t) {
        const AttachTemplates = new Attachment("src/assets/img/jpeg/Templates.jpg");
        let getTEMPLATE = {
            get: false,
            template: false,
            errorMsg: ''
        }

        await channel.send(
            {
                embed: new ClientEmbed(author)
                    .setDescription(`${Emojis.Build} **${author.username}** ${t('comandos:creatememe.panel', {
                        size: 8
                    })}`)
                    .setImage("attachment://Templates.jpg"),
                files: [AttachTemplates]
            }
        ).then(async (msg) => {
            await channel.awaitMessages(msg => msg.author.id === author.id, {
                max: 1,
                time: 30000,
                errors: ['time']
            }).then(async (meme) => {
                const response = Number(meme.first().content);
                meme.first().delete().catch(() => { });
                if (!isNaN(response)) {
                    const num = Math.round(response);
                    if (num > 0 && num <= 8) {
                        const template = await this.client.canvas.templates.get('type === 1', memes[num]);
                        if (!template) {
                            getTEMPLATE.errorMsg = 'unavailableTemplate'
                        } else {
                            getTEMPLATE.get = true
                            getTEMPLATE.template = template
                        }
                    } else {
                        getTEMPLATE.errorMsg = 'unavailableNumber'
                    }
                } else {
                    getTEMPLATE.errorMsg = 'noResponseNumber'
                }
            }).catch(() => {
                getTEMPLATE.errorMsg = 'timeOut'
            })
            return msg.delete()
        })
        return getTEMPLATE;
    }
}

module.exports = CreateMeme;