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
        console.log('masuk sini kah? searchsongfromquery')
        console.log(req.body.value)
        genius
            .search(req.body.value)
            .then((data) => {
              console.log(data, 'ini consolelog data')
                res.json(data.hits)
            })
            .catch(err => {
                res
                    .status(500)
                    .json(err);
            })

    }

    static getSongFromId(req, res) {
      console.log('masuk ke songfromid')
      console.log(req.params)
        let passData = {}
            

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
  
   static getVids(req, res) {
    console.log(typeof req.body.title)
    axios({
      method: 'get',
      url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${req.body.title}&key=${process.env.YOUTUBE_API}`
    })
      .then(({data}) => {
        // console.log(data, 'apa data ini?')
        res.json(data.items[0].id.videoId)
      })
      .catch(err => {
        console.log('masuk errror get vids')
        res.status(500).json(err)
      })
  }
}

module.exports = Song