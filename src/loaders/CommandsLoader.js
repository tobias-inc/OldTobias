const { CommandLoader, Command } = require("../structures/CMD/");
const { readdirSync, readdir } = require("fs");

const DIR_COMMANDS = 'src/commands';

module.exports = class ClientCommands extends CommandLoader {
    constructor(client) {
        super(client)
        this.name = 'CommandsLoader'
        this.client = client
        this.commands = {
            all: new client.collection,
            subcommands: new client.collection,
            categories: [],
            load: async (cmd) => await this.CommandLoad(cmd)
        }
    }

    async call() {
        this.client.commands = this.commands;
        return this.ViewCommands().then(() => this.client.LOG('All commands successfully loaded', 'CommandsLoader'));
    }

    async ViewCommands(dirPath = DIR_COMMANDS, subCommand = false, arr = []) {
        const folders = await readdirSync(dirPath);

        if (folders) {
            if (subCommand && dirPath !== DIR_COMMANDS) {
                for (const file of folders) {
                    if (file.endsWith('.js')) {
                        arr.push({ file: file, dir: (`${dirPath}/${file}`) })
                    }
                }
                return this.addSubCommands(arr);
            }

            await Promise.all(folders.map(folder => {
                this.client.commands.categories.push({
                    size: 0,
                    name: folder
                });
                readdir((`${dirPath}/${folder}`), async (err, files, numFile = 0, array_content = []) => {
                    if (!files || err) return;
                    while (files.length > numFile) {
                        const file = files[numFile];
                        array_content.push({ fileName: file, fileFolder: folder });
                        ++numFile
                    }
                    return this.pushCommands(array_content);
                })
            }))
            return true;
        }
    }

    async pushCommands(files) {
        for (const file of files) {
            if (file.fileName.endsWith('.js')) {
                this.addCommand({ file: file.fileName, dir: (`${DIR_COMMANDS}/${file.fileFolder}/${file.fileName}`), folder: file.fileFolder });
            } else {
                this.ViewCommands((`${DIR_COMMANDS}/${file.fileFolder}/${file.fileName}`), true)
            }
        }
        return true;
    }

    addSubCommands(subcommands) {
        for (const subcommand of subcommands) {
            try {
                const requireSubCommand = require(`../../${subcommand.dir}`);
                const SubCommand = new requireSubCommand(this.client, subcommand.dir);

                if (!(SubCommand instanceof Command)) {
                    this.client.LOG_ERR(this.name, `FILE ${file}`, 'SubCommand', 'No SubCommand!')
                } else {
                    if (!this.client.commands.subcommands.get(SubCommand.category)) {
                        this.client.commands.subcommands.set(SubCommand.category, new this.client.collection);
                    }

                    this.client.commands.subcommands.get(SubCommand.category).set(SubCommand.name, SubCommand);
                }
            } catch (err) {
                this.client.LOG_ERR(err, this.name, `FILE ${subcommand.file}`, 'SubCommand')
            }
        }
    }

    async addCommand({ file, dir, folder }, error = false) {
        if (file.endsWith('.js')) {
            try {
                await require(`../../${dir}`);
            } catch (err) {
                error = true
                this.client.LOG_ERR(err, this.name, `FILE ${file}`);
            } finally {
                if (!error) {
                    try {
                        const requireCommand = require(`../../${dir}`);
                        const command = new requireCommand(this.client);

                        if (!(command instanceof Command)) {
                            return this.client.LOG_ERR(this.name, `FILE ${file}`, 'No Command!')
                        }

                        ++this.client.commands.categories.find(({ name }) => (
                            name === folder
                        )).size

                        return this.client.commands.all.set(command.name, {
                            commandHelp: command,
                            directory: dir
                        })
                    } catch (err) {
                        this.client.LOG_ERR(err, this.name, `FILE ${file}`);
                    }
                }
            }
        }
        return true;
    }
}