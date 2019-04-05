const axios = require('axios');
const rndSong = require('rnd-song')
let musixmatch = axios.create({
    baseURL: 'http://api.musixmatch.com/ws/1.1/'
});

const geniusApi = require('genius-api');
const genius = new geniusApi(process.env.GENIUS_API_KEY);

class Song {

    static getRandomSong(req, res) {
        let options = {
            api_key: process.env.MUSIXMATCH_KEY,
            snippet: true,
            language: 'en'
        }

        let search = ''

        rndSong(options, async function (err, res) {
            if (!err) {
                search = await [res.track.artist_name, res.track.track_name]
                searchArtist(search)
            } else {
                console.log(err);

            }
        })

        function searchArtist(songs) {
            axios
                .get(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${songs[0]}`, {
                    headers: {
                        'X-RapidAPI-Key': process.env.RAPIDKEY
                    }
                })
                .then(({ data }) => {
                    let result = ''
                    data.data.forEach(e => {
                        if (songs[1] === e.title && songs[0] === e.artist.name) {
                            result = e
                        }
                    })
                    res.status(200).json(result)

                })
                .catch(err => {
                    res.status(500).json(err)
                })
        }
    }

    static getOneSong(req, res) {
        axios
            .get(`https://deezerdevs-deezer.p.rapidapi.com/search?q=${req.query.name}`, {
                headers: {
                    'X-RapidAPI-Key': process.env.RAPIDKEY
                }
            })
            .then(({ data }) => {
                let result = ''
                data.data.forEach(e => {
                    if (req.query.title === e.title && req.query.name === e.artist.name) {
                        result = e
                    }
                })
                res.status(200).json(result)

            })
            .catch(err => {
                res.status(500).json(err)
            })
    }

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