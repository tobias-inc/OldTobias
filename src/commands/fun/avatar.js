const {
    Discord = require("discord.js"),
    Attachment = Discord.Attachment,
    Command
} = require("../../");

class Avatar extends Command {
    constructor(client) {
        super(client, {
            name: "avatar",
            description: "Avatar de um usuário",
            usage: { args: true, argsNeed: false, argsTxt: "<user>", need: "{prefix} {cmd} {args}" },
            category: "Fun",
            cooldown: 3000,
            aliases: ["picture"],
            Permissions: ["ATTACH_FILES"],
            UserPermissions: [],
            devNeed: false,
            needGuild: false
        });
    }

    async run({ message, guild, author, args }, t, { displayAvatarURL } = this.client.user) {
        let AVATAR = {
            type: false,
            buffer: false
        }

        const USER = (await this.GetUser(args, message, guild, author));

        if (USER.displayAvatarURL && USER.displayAvatarURL.endsWith(".gif")) {
            AVATAR.buffer = USER.displayAvatarURL
            AVATAR.type = 'gif'
        } else if (USER.displayAvatarURL) {
            AVATAR.type = 'png'
            AVATAR.buffer = await this.client.canvas.templates.get(false, 'UserAvatar')
                .then(async ({ run }) => { return await run(USER.displayAvatarURL) })
        } else {
            AVATAR.type = 'png'
            AVATAR.buffer = await this.client.canvas.templates.get(false, 'UserAvatar')
                .then(async ({ run }) => { return await run(displayAvatarURL) })
        }

        const attachment = new Attachment(AVATAR.buffer, `${USER.username}.${AVATAR.type}`);
        return message.channel.send(`\`${USER.tag}\``, attachment);
    }
}

module.exports = Avatar;