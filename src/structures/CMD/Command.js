const ErrorCommand = require("./ErrorCommand.js");
const TestCommand = require("./TestCommand.js");
const ClientEmbed = require("../ClientEmbed.js");

module.exports = class Command extends TestCommand {
    constructor(client, options, subcommand = false) {
        super(client);

        this.client = client
        this.name = options.name || "Sem Nome"
        this.description = options.description || "Nenhuma"
        this.usage = options.usage || { args: false, argsNeed: false }
        this.category = options.category || "Nenhuma"
        this.aliases = options.aliases || []
        this.Permissions = options.Permissions || ["SEND_MESSAGES"]
        this.UserPermissions = options.UserPermissions || []
        this.subcommand = subcommand,
        this.aliases = options.aliases || []
        this.djRoleNeed = options.roleDj != undefined ? options.roleDj : false
        this.managerNeed = options.managerPermission != undefined ? options.managerPermission : false

        if (subcommand) {
            this.referenceCommand = options.referenceCommand || this.client.Error('No command reference!');
        } else {
            this.cooldownTime = options.cooldownTime || 5000
            this.devNeed = options.devNeed !== undefined ? options.devNeed : false
            this.ownerNeed = options.ownerNeed !== undefined ? options.ownerNeed : false
            this.needGuild = options.needGuild !== undefined ? options.needGuild : true
            this.vipUser = options.vipUser !== undefined ? options.vipUser : false
            this.cooldown = new Map();
        }
    }

    async _run(settings, { channel, command, author, prefix, t } = settings) {
        try {
            await this.run(settings, t);
            return true;
        } catch (e) {
            return ErrorCommand.commandError(
                this.client,
                channel,
                command,
                author,
                prefix,
                t,
                e
            )
        }
    }
    verifyVoice(t, guild, channel, author, voiceChannel, playCommand = false) {
        const embed = new ClientEmbed(author);
        const guildQueue = this.client.music.module.queue.get(guild.id);

        if (voiceChannel && playCommand && !guildQueue && !(voiceChannel.joinable && voiceChannel.speakable)) {
            const err = voiceChannel.joinable ? t('errors:music.speak') : t('errors:music.conect');
            channel.send(embed
                .setTitle(t('errors:music.title',{err}))
                .setColor(process.env.ERROR_COLOR)
            )
            return false;
        }
        if (!voiceChannel) {
            let response = 'errors:music.enter'
            if (guildQueue) response = 'errors:music.comein'
            channel.send(embed
                .setTitle(t(response))
                .setColor(process.env.ERROR_COLOR)
            )
            return false;
        } else if (guildQueue) {
            if (guildQueue.voiceChannel.id !== voiceChannel.id) {
                channel.send(embed
                    .setTitle(t('errors:music.comein'))
                    .setColor(process.env.ERROR_COLOR)
                )
                return false;
            }
        };
        return true;
    }
    coolDown(author){
        this.cooldown.set(author.id,Date.now()); 
        setTimeout(() => { 
        this.cooldown.delete(author.id); 
        }, this.cooldownTime);
    }
};  