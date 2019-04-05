const rndSong = require('rnd-song')

function random() {
    let options = {
        api_key: process.env.MUSIXMATCH_KEY,
        //   genre: 14,
        snippet: true,
        language: 'en'
    }
    
    rndSong(options, function (err, res) {
        // return new Promise((resolve,reject) => {
            if (!err) {
                console.log(`Snippet: ${res.snippet.snippet_body}`);
                console.log(`Track: ${res.track.track_name}`);
                console.log(`Album: ${res.track.album_name}`);
                console.log(`Artist: ${res.track.artist_name}`);
                search = res.track.artist_name
                // name = 
                // resolve(res.track)
            } else { 
                // console.log(new Error(err)); 
                // reject(err)
            }
        // })
    })
}

module.exports = random