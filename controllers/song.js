const axios = require('axios');
let musixmatch = axios.create({
    baseURL: 'http://api.musixmatch.com/ws/1.1/'
});

const geniusApi = require('genius-api');
const genius = new geniusApi(process.env.GENIUS_API_KEY);

class Song {
    static searchSongFromQuery(req, res) {
        // musixmatch
        //     .get(`track.search?apikey=${process.env.API_KEY}&q_${req.body.key}=${req.body.value}`)
        //     .then(({ data }) => {

        //         res.json(data);
        //     })
        //     .catch(err => {
        //         console.log(err)
        //         res
        //             .status(500)
        //             .json({
        //                 message: err
        //             })
        //     })

        genius
            .search(req.body.value)
            .then((data) => {
                res.json(data)
            })
            .catch(err => {
                res
                    .status(500)
                    .json(err);
            })

    }

    static getSongFromId(req, res) {
        let passData = {}
            // musixmatch
            //     .get(`track.get?commontrack_id=${req.params.commontrack_id}&apikey=${process.env.API_KEY}`)
            //     .then(({ data }) => {
            //         passData.songData = data.message.body;
            //         return musixmatch
            //             .get(`track.lyrics.get?commontrack_id=${req.params.commontrack_id}&apikey=${process.env.API_KEY}`)
            //     })
            //     .then(({ data }) => {
            //         passData.lyricData = data.message.body;
            //         res.json(passData);
            //     })
            //     .catch(err => {
            //         console.log(err)
            //         res
            //             .status(500)
            //             .json({
            //                 message: err
            //             })
            //     })

        genius
            .song(req.params.commontrack_id)
            .then(data => {

                let potong = data.song.embed_content
                let tanda;
                for (let i = 0; i < potong.length; i++) {
                    if (potong[i] === `'` && potong[i + 1] === `/`) {
                        tanda = i;
                        break;
                    }
                }

                // Menambahkan http agar bisa di embed
                data.song.embed_content = potong.slice(0, tanda + 1) + 'http:' + potong.slice(tanda + 1)
                console.log(data.song.embed_content.length, potong);
                res.json(data.song);
            })
            .catch(err => {
                console.log(err);
            })
    }

    static getArtistFromId(req, res) {

        genius
            .artist(req.params.id)
            .then(data => {
                // Dapetin data artist dengan  id 
                res.json(data.artist);
            })
            .catch(err => {
                console.log(err);
            })
    }
}

module.exports = Song