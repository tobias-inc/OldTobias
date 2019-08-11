const genius = require('genius-api');
const getLyrics = require('lyricist')

module.exports = class GeniusApi {
    constructor() {
        this.name = 'GeniusApi'
        this.api = {
            genius: false,
            lyrics: false
        }
    }

    load() {
        this.api.genius = new genius(process.env.GENIUS_API);
        this.api.lyrics = new getLyrics(process.env.GENIUS_API);
        return true;
    }

    findTrack(search) {
        return this.api.genius.search(search).then(res => {
            if (!res.hits.length) return res
            else {
                for (let i = 0; i < res.hits.length; i++) {
                    let {
                        result: {
                            song_art_image_thumbnail_url: thumbnailUrl,
                            title_with_featured: title,
                            primary_artist: { name: artist },
                            url, id, path
                        }
                    } = res.hits[i]
                    res.hits[i] = { thumbnailUrl, title, artist, url, path, id }
                }
                return res
            }
        });
    }

    loadLyrics(query) {
        return this.api.lyrics.song(query, { fetchLyrics: true }).then(res => res.lyrics);
    }
}