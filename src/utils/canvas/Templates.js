const { createCanvas, loadImage } = require("canvas");
const TemplatesUtils = require("./TemplatesUtils.js");
const Color = require("../Color.js");

const moment = require("moment");
const fetch = require('node-fetch');

require("moment-duration-format");

module.exports = class CanvasTemplates extends TemplatesUtils {
    constructor(client) {
        super(client)
        this.client = client
        this.templates = {
            types: [],
            get: async (filter, get) => {
                let template = this.templates.types
                if (filter && get) {
                    template = await eval('template.filter(tp => tp.' + filter + ')');
                    return template.find(tp => tp.name === get);
                } else if (get) {
                    return template.find(tp => tp.name === get);
                } else {
                    return await eval('template.filter(tp =>' + filter + ')');
                }
            }
        }
    }

    async load() {
        return await new Promise((resolve, reject) => {
            resolve(this.setTemplates())
        })
    }

    async DrakeHotline(txt, user) {
        const { premiumUtils: { textcolor } } = await this.client.database.users.findOne(user.id);
        const TEXT = Object.values(txt);
        const source = await loadImage("src/assets/img/jpeg/DrakeHotline.jpg");
        const canvas = createCanvas(source.width, source.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
        ctx.font = '26px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[0].content, 255, 60, 28, 240);
        ctx.font = '26px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[1].content, 255, 305, 28, 240);
        return canvas.toBuffer()
    }

    async MindExplosion(txt, user) {
        const { premiumUtils: { textcolor } } = await this.client.database.users.findOne(user.id);
        const TEXT = Object.values(txt);
        const source = await loadImage("src/assets/img/jpeg/MindExplosion.jpg");
        const canvas = createCanvas(source.width, source.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
        ctx.font = '26px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[0].content, 10, 30, 28, 340);
        ctx.font = '26px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[1].content, 10, 235, 28, 340);
        ctx.font = '26px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[2].content, 10, 438, 28, 340);
        ctx.font = '26px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[3].content, 10, 643, 28, 340);
        return canvas.toBuffer();
    }

    async DibreMalandro(txt, user) {
        const { premiumUtils: { textcolor } } = await this.client.database.users.findOne(user.id);
        const TEXT = Object.values(txt);
        const source = await loadImage("src/assets/img/jpeg/DibreDeMalandro.jpg");
        const canvas = createCanvas(source.width, source.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
        ctx.font = '26px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[0].content, 10, 30, 28, 540);
        return canvas.toBuffer();
    }

    async TemCorage(txt, user) {
        const { premiumUtils: { textcolor } } = await this.client.database.users.findOne(user.id);
        const TEXT = Object.values(txt);
        const source = await loadImage("src/assets/img/jpeg/AquiTemCorage.jpg");
        const canvas = createCanvas(source.width, source.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
        ctx.font = '30px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[0].content, 10, 50, 32, 700);
        return canvas.toBuffer();
    }

    async PinguPuto(txt, user) {
        const { premiumUtils: { textcolor } } = await this.client.database.users.findOne(user.id);
        const TEXT = Object.values(txt);
        const source = await loadImage("src/assets/img/jpeg/PinguPuto.jpg");
        const canvas = createCanvas(source.width, source.height);
        const ctx = canvas.getContext('2d');
        console.log(source.width, source.height)
        ctx.drawImage(source, 0, 0);
        ctx.font = '30px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[0].content, 10, 20, 32, 490);
        ctx.font = '30px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[0].content, 10, 250, 32, 490);
        return canvas.toBuffer();
    }

    async DibreGringo(txt, user) {
        const { premiumUtils: { textcolor } } = await this.client.database.users.findOne(user.id);
        const TEXT = Object.values(txt);
        const source = await loadImage("src/assets/img/jpeg/DibreGringo.jpg");
        const canvas = createCanvas(source.width, source.height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(source, 0, 0);
        ctx.font = '26px Arial';
        ctx.fillStyle = textcolor;
        ctx.printAt(TEXT[0].content, 10, 30, 30, 400);
        return canvas.toBuffer();
    }

    async Avatar(avatar) {
        const canvas = createCanvas(128, 128);
        const ctx = canvas.getContext('2d')
        const GETTER = await fetch(avatar)
            .then(res => res.buffer());
        const AVATAR = await loadImage(GETTER);
        ctx.drawImage(AVATAR, 0, 0, 128, 128);
        return canvas.toBuffer();
    }

    async SpotifyTemplate(user) {
        const canvas = createCanvas(750, 270);
        const ctx = canvas.getContext('2d');

        let trackImg = user.presence.game.assets.largeImageURL;
        let trackName = user.presence.game.details;
        let trackAlbum = user.presence.game.state;

        let AlbumArray = trackAlbum.split(';');

        if (AlbumArray.length > 2) {
            if (AlbumArray.map(a => a).slice(0, AlbumArray.length).toString().length <= 43) {
                trackAlbum = AlbumArray.map(art => art).slice(0, AlbumArray.length).join(",").toLocaleString();
            } else {
                trackAlbum = AlbumArray.map(art => art).slice(0, AlbumArray.length - 1).toString().length <= 43 ? AlbumArray.map(art => art).slice(0, AlbumArray.length - 1).join(",").toLocaleString() + '...' : AlbumArray.map(art => art).slice(0, AlbumArray.length - 2).toString().length <= 43 ? AlbumArray.map(art => art).slice(0, AlbumArray.length - 2).join(",").toLocaleString() + '...' : AlbumArray.map(art => art).slice(0, 2).join(",").toLocaleString() + '...';
            }
        } else {
            trackAlbum = AlbumArray.map(art => art).join(",").toLocaleString();
        }

        let background;
        background = await fetch(trackImg)
            .then(res => res.buffer());
        let thumb;
        thumb = await fetch(trackImg)
            .then(res => res.buffer());

        const buttom = await loadImage("src/assets/img/png/buttomsSpotifyPlay.png");
        const backgroundIMG = await loadImage(background);
        const musicIMG = await loadImage(thumb);

        const realColor = new Color('#000')
        const gradientColor = (a) => realColor.setAlpha(a).rgba(true)

        var grd = ctx.createLinearGradient(0, 0, 0, canvas.width);

        grd.addColorStop(0, gradientColor(0.3));
        grd.addColorStop(1, gradientColor(0.9));
        grd.addColorStop(0, gradientColor(0.4));
        grd.addColorStop(1, gradientColor(0.9));

        let THUMB_WIDTH = Number(canvas.width - canvas.height)
        let THUMB_HEIGHT = THUMB_WIDTH

        ctx.drawImage(backgroundIMG, canvas.height, -((THUMB_WIDTH - canvas.height) / 2), THUMB_WIDTH, THUMB_HEIGHT);
        ctx.blur(3);

        ctx.fillStyle = grd;
        ctx.fillRect((canvas.height - 20), 0, (THUMB_WIDTH + 20), canvas.height);

        ctx.drawImage(musicIMG, 0, 0, 270, 270);

        ctx.drawImage(buttom, 35, 20, canvas.width, canvas.height);

        ctx.fillStyle = '#404040';
        ctx.roundRect(347, 250, 320, 10, 6, true);

        let calcTotal = (user.presence.game.timestamps.end - user.presence.game.timestamps.start) / 1000
        let tempoTotal = moment.duration(calcTotal * 1000, "milliseconds").format('mm:ss', { trim: false }).toString();
        let calcAtual = (new Date() - user.presence.game.timestamps.start) / 1000
        let tempoAtual = moment.duration(calcAtual * 1000, "milliseconds").format('mm:ss', { trim: false }).toString();

        let barra;

        let utilBarra1 = moment.duration(calcAtual * 1000, "milliseconds").format("ss", { trim: false });
        let utilBarra2 = moment.duration(calcTotal * 1000, "milliseconds").format("ss", { trim: false });

        if (utilBarra1.includes(',')) {
            utilBarra1 = utilBarra1 ? utilBarra1.replace(',', '') : ''
        }

        if (utilBarra2.includes(',')) {
            utilBarra2 = utilBarra1 ? utilBarra1.replace(',', '') : ''
        }

        if (utilBarra1 == '00') {
            barra = 0
        } else {
            barra = 320 / utilBarra2 * utilBarra1
        }

        barra = barra.toFixed(0);

        if (barra > 10) {
            ctx.fillStyle = '#FFFFFF';
            ctx.roundRect(347, 250, Number(barra), 10, 6, true);
        }
        else {
            barra = 10
            ctx.fillStyle = '#FFFFFF';
            ctx.roundRect(347, 250, Number(barra), 10, 6, true);
        }

        ctx.font = '16px "Montserrat Medium"';
        ctx.fillStyle = process.env.SPOTIFY_TEXT_COLOR;
        ctx.fillText(tempoAtual, 290, 260);

        ctx.font = '16px "Montserrat Medium"';
        ctx.fillStyle = process.env.SPOTIFY_TEXT_COLOR;
        ctx.fillText(tempoTotal, 680, 260);

        let length = (trackName.length / 32);
        length = Number((String(length))[0]);
        let trackY = 28 * (length === 0 ? 1 : length === 1 ? 2 : length) + 35

        ctx.font = 'italic 20px Montserrat';
        ctx.fillStyle = process.env.SPOTIFY_ALBUM_COLOR;
        ctx.fillText(`${trackAlbum}`, 280, trackY);

        let text = `${trackName}`;
        ctx.font = 'italic 28px Montserrat Black';
        ctx.fillStyle = process.env.SPOTIFY_TEXT_COLOR;

        ctx.printAt(text, 280, 35, 30, 465);

        ctx.fillStyle = '#FFFFFF'
        ctx.globalCompositeOperation = 'destination-in'

        ctx.roundRect(0, 0, canvas.width, canvas.height, 12, true);

        return canvas.toBuffer();
    }
}