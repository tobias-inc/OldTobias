const {
	Discord = require('discord.js'),
	ms = require("ms"),
	Command, Emojis, ClientEmbed
} = require("../..");

class Mute extends Command {
	constructor(client) {
		super(client, {
			name: "Mute",
			description: "Silencia um membro",
			usage: { args: true, argsNeed: true, argsTxt: "<USER>", need: "{prefix} {cmd} {args}" },
			category: "Moderation",
			cooldown: 3000,
			aliases: ["silenciar", "mutar"],
			Permissions: ["MANAGE_ROLES"],
			UserPermissions: ["MANAGE_MESSAGES"],
			devNeed: false,
			needGuild: true
		});
	}

	async run({ message, channel, guild, author, args }, t, { displayAvatarURL } = this.client.user) {
		const EMBED = new ClientEmbed(author)
			.setAuthor(this.client.user.username, displayAvatarURL)
			.setThumbnail(guild.iconURL ? guild.iconURL : displayAvatarURL);

		const USER = (await this.GetUser(args, message, guild, true));
		if (!USER) return channel.send(t('clientMessages:Mute.nouser')); //user exists
		if (USER === true) return channel.send(t('clientMessages:Mute.nouser'));

		let muteRole = roles.find(f => f.name == 'TobiaMuted')
		if (!muteRole) {
			muteRole = await message.guild.createRole({
				name: "TobiasMuted",
				color: process.env.ERROR_COLOR,
				permissons: []
			});
			message.guild.channels.forEach(async (channel, id) => {
				await channel.overwritePermissions(muterole, {
					SEND_MESSAGES: false,
					ADD_REACTIONS: false,
					VIEW_CHANNEL: false
				});
			})
		}
		let muteTime = args[1];
		if (!muteTime) return channel.send(t('clientMessages:Mute.Notime'));

		guild.member(USER.id).addRole(muteRole.id);

		channel.send(EMBED
			.setDescription(`${Emojis.Puto} | ` + t('clientMessages:Mute.description', { USER: USER }))
			.addField(`${Emojis.Love} |` + t('clientMessages:Mute.muteAuthor'), message.author.username)
			.addField(`${Emojis.Risada} | ` + t('clientMessages:Kick.punishment'), "Mute")
			.addField(`${Emojis.Popcorn} | ` + t('clientMessages:Kick.punished'), USER.username)
			.addField(`${Emojis.Certo}|` + t('clientMessages:Mute.time'), `${ms(ms(muteTime))}`)
			.setColor(process.env.COLOR_EMBED)
		)
		const resolveTime = async ms => await new Promisse((res, rej) => setTimeout(res, ms));
		return resolveTime(ms).then(() => {
			guild.member(USER.id).removeRole(muteRole.id);
			channel.send(t('clientMessages:Mute.unmute', { user: USER }));
		})
	}
}
module.exports = Mute;
