const Command = require("./Command.js");

module.exports = class CommandUtils {
    constructor(client) {
        this.client = client
    }

    async CommandLoad(cmd, t, dir = cmd.directory) {
        let ocurred = ({ error: false, errorEmit: false });
        delete require.cache[require.resolve(`../../../${dir}`)];

        try {
            await require(`../../../${dir}`);
        } catch (e) {
            ocurred.error = true, ocurred.errorEmit = e;
            return ocurred
        }

        this.client.commands.all.delete(cmd.commandHelp.name);

        const required = require(`../../../${dir}`);
        const command = new required(this.client);

        if (!(command instanceof Command)) {
            ocurred.error = true, ocurred.errorEmit = t('errors:awaitReloadCommandNoCMD');
            return ocurred
        }

        this.client.commands.all.set(command.name, {
            commandHelp: command,
            directory: dir
        });

        const subcommands = (this.client.commands.subcommands.get(command.category) &&
            this.client.commands.subcommands.get(command.category).filter(
                cmd => cmd.referenceCommand == command.name
            )
        ) || false

        if (subcommands) {
            await Promise.all(subcommands.array().map(subcommand => {
                delete require.cache[require.resolve(`../../../${subcommand.directory}`)];
                this.client.commands.subcommands.get(command.category).delete(subcommand.name);
                try {
                    const requiredSub = new (require(`../../../${subcommand.directory}`))(this.client, subcommand.directory);
                    this.client.commands.subcommands.get(command.category).set(requiredSub.name, requiredSub)
                } catch (e) {
                    this.client.commands.subcommands.get(command.category).set(subcommand.name, subcommand)
                }
            }))
        }

        return ocurred
    }
}