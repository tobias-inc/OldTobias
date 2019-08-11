const GuildMusic = require("./GuildMusic.js");
const moment = require("moment");

require("moment-duration-format");

module.exports = class MusicQueue extends GuildMusic {
    constructor(guild, voiceChannel, channel, client) {
        super(guild, client);
        this.initQueue = Date.now()
        this.voiceChannel = voiceChannel
        this.msgChannel = channel
        this.client = client
        this.guild = guild
        this.songs = []
        this.songsBackup = []
        this.volume = 200
        this.modifyVolume = false
        this.loop = false
        this.playing = false
        this.songPlaying = false
        this.lastMessage = false
        this.lastMessageId = false
        this.setVol = (vol) => vol / 100;
    }

    get _queue() {
        return this;
    }

    get queueFullDuration() {
        let arr = this.songs.concat([this.songPlaying]);
        for (let i = 0; i < arr.length; i++) arr[i] = arr[i].ms;
        let calcInSeconds = (arr.reduce((a, b) => a + b, 0)) - (this.dispatcher.time);
        return moment.duration(calcInSeconds, 'milliseconds').format('hh:mm:ss', { stopTrim: 'm' });
    }

    get nowDuration() {
        let stopTrim = this.songPlaying.durationContent.split(':').length > 2 ? 'h' : 'm';
        return moment.duration(this.dispatcher.time, 'milliseconds').format('hh:mm:ss', { stopTrim });
    }

    set() {
        return this.client.music.module.queue.set(this.guild.id, this);
    }

    stop() {
        return this.emit('stopForce');
    }

    skip() {
        return this.dispatcher.end();
    }

    queueLoop(l) {
        this.loop = l;
    }

    clearQueue() {
        return this.songs.splice(0);
    }

    removeOne(num) {
        let song = this.songs[num - 1];
        if (this.songsBackup.indexOf(song) != -1) this.songsBackup.splice(this.songsBackup.indexOf(song), 1);
        return this.songs.splice((num - 1), 1);
    }

    jump(num) {
        this.songs = this.songs.splice(num - 1);
        return this.dispatcher.end();
    }

    setLastMesage(msg) {
        this.lastMessage = msg;
        this.lastMessageId = msg.id;
    }

    resetQueue() {
        this.songsBackup.splice(0);
        this.modifyVolume = true
        this.songs.splice(0);
        this.loop = false;
        this.volume = 200
    }

    async volUpdate(vol) {
        this.volume = vol;
        this.modifyVolume = true
        return this.dispatcher.setVolume(this.setVol(vol));
    }
}