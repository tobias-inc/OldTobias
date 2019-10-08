module.exports = class DatabaseUtils {
    constructor(client) {
        this.client = client
    }

    async ClientMaintence(maintence) {
        return await this.client.database.clientUtils.update(this.client.user.id, { $set: { maintence } })
    }

    async CommandMaintence(command, maintence) {
        if (!command) throw new Error('unidentified command');
        return await this.client.database.comandos.update(command, { $set: { maintence } })
    }

    async setPrefix(guild, prefix) {
        if (!guild) throw new Error('unidentified server');
        return await this.client.database.guilds.update(guild.id, { $set: { prefix } })
    }

    async setLanguage(guild, language) {
        if (!guild) throw new Error('unidentified server');
        return await this.client.database.guilds.update(guild.id, { $set: { language } })
    }

    async setLink(user, redirect) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'vip.redirect': redirect } })
    }

    async setOwner(user, owner) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.owner': owner } })
    }

    async daily(user, coins) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'coins' : coins } })
    }
    async setDeveloper(user, developer) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.developer': developer } })
    }
    async setDonator(user, donator) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.donator': donator } })
    }

    async setTranslater(user, translater) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.translater': translater } })
    }

    async setDesigner(user, designer) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'contributor.designer': designer } })
    }

    async setBlacklist(user, blacklist) {
        if (!user) throw new Error('unidentified user');
        return await this.client.database.users.update(user.id, { $set: { 'blacklist': blacklist } })
    }

    async removeCopyEmojis(g, user) {
        if (!(g || user)) throw new Error('unidentified parameters');
        return await this.client.database.users.update(user.id, { $pull: { 'utils.copyEmojis': g } })
    }

    async setCopyEmojis(emojis, user, guild, update = false) {
        if (!(emojis || user || guild)) throw new Error('unidentified parameters');

        if (update) {
            const guildEm = await this.client.database.users.findOne(user.id).then((d) => d.utils.copyEmojis.find(e => e.guildID == guild.id));
            await this.client.database.users.update(user.id, { $pull: { 'utils.copyEmojis': guildEm } });
        }

        const em = [];
        await Promise.all(emojis.map(e => {
            let animated = e.url.endsWith('.png') || e.url.endsWith('.jpg') ? false : true;
            em.push({ url: e.url, name: e.name, animated })
        }));
        return await this.client.database.users.update(user.id, {
            $push: {
                'utils.copyEmojis': {
                    guildID: guild.id,
                    guildName: guild.name,
                    emojisSize: emojis.size,
                    emojis: em
                }
            }
        })
    }
}