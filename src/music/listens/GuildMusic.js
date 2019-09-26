const { EventEmitter } = require("events");
const youtube_dl = require('youtube-dl');
const moment = require("moment");

const streamOptions = {
    seek: 0,
    passes: 10,
    bitrate: 1024
}

module.exports = class GuildMusic extends EventEmitter {
    constructor(guild, client) {
        super();
        this.client = client
        this.guild = guild
        this.connection = false
        this.dispatcher = false

        this.on('stopForce', () => {
            this.removeAllListeners();
            this.deleteLastMessage();
            this.connection.disconnect();
            this.client.music.module.queue.delete(this.guild.id);
        });
        this.on('stop', async () => {
            if (this._queue.loop) return this._queue.songsBackup && this.restartPlayerForLoop();
            this.removeAllListeners();
            this.client.music.module.queue.delete(this.guild.id);
            this.connection.disconnect();
        });
        this.on('errorInStream', (s, e) => {
            console.log(('StreamError in guild ' + `${this.guild.name}/-ID: ${this.guild.id}`), e.message);
            this.emit('errorSong', s, e);
            return this.viewQueueContent();
        })
    }

    async play(song) {
        if(this.voiceChannel.members.size === "1") return this.voiceChannel.leave()
        if (!song || !song.url) throw new Error('No song identify');
        streamOptions['volume'] = this._queue.setVol(this._queue.volume);
        this._queue.songs.shift();

        try {
            this.dispatcher = await this.connection.playStream(youtube_dl(song.url), streamOptions);
        } catch (e) {
            return this.emit('errorInStream', song, e);
        }

        this.emiters(song);
        this._queue.playing = true
        this._queue.songPlaying = song

        if (!this._queue.modifyVolume) this.dispatcher.setVolumeLogarithmic(1.2);
    }

    async goPlay(num) {
        let song = this._queue.songs[num];
        if (!song || !song.url) throw new Error('No song identify');
        this.connection = await this._queue.voiceChannel.join();
        return this.play(song);
    }

    emiters(s) {
        if (this.dispatcher) {
            this.dispatcher.on('start', () => this.emit('start', s));
            this.dispatcher.on('error', (e) => this.emit('errorInStream', s, e));
            this.dispatcher.on('end', () => {
                this.deleteLastMessage();
                this.viewQueueContent();
            });
        }
    }

    deleteLastMessage() {
        return this._queue.lastMessage && this._queue.lastMessage.delete().catch(() => { });
    }

    setSongDuration(s) {
        return moment.duration(s.ms, 'milliseconds').format('hh:mm:ss', { stopTrim: 'm' });
    }

    async viewQueueContent() {
        let queueSong = this._queue.songs;
        if (!queueSong.length) {
            return this.emit('stop', this._queue.songPlaying.addedBy, this._queue.loop);
        }
        return this.play(queueSong[0]);
    }

    async restartPlayerForLoop() {
        const songs = this._queue.songsBackup;
        await Promise.all(songs.map(song => this._queue.songs.push(song)));
        return this.goPlay(0);
    }

    async pushSongs(songs, addedBy, returnPlayer = false) {
        await Promise.all(songs.map(song => {
            song['addedBy'] = addedBy;
            song['durationContent'] = this.setSongDuration(song);
            this._queue.songs.push(song);
            this._queue.songsBackup = this._queue.songsBackup.concat([song]);
        }));
        if (returnPlayer) this.play(this._queue.songs[0]);
        return this.emit('queue', songs, addedBy);
    }

    errorResponse() {
        const songsBySkip = this._queue.songs.size;
        if (songsBySkip) {
            return this.goPlay(0);
        } else {
            if (this._queue.songsBackup.indexOf(this._queue.songPlaying) != -1) {
                this._queue.songsBackup.splice(this.songsBackup.indexOf(this._queue.songPlaying), 1);
            }
            return this.restartPlayerForLoop();
        }
    }
}