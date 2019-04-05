const router = require('express').Router();
const songController = require('../controllers/song');
router.get('/', songController.getRandomSong)
router.post('/search', songController.searchSongFromQuery);
router.get('/:commontrack_id', songController.getSongFromId);
router.get('/artist/:id', songController.getArtistFromId);
router.post('/getVideo', songController.getVids)

module.exports = router