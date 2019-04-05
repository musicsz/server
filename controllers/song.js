const axios = require('axios')

class Song {

  static getVids(req, res) {
    axios({
      method: 'get',
      url: `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${req.body.title}&key=${process.env.YOUTUBE_API}`
    })
      .then(({data}) => {
        console.log(data)
        res.json(data.items[0].id.videoId)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
}

module.exports = Song