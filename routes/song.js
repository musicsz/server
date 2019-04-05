const router = require('express').Router();
const songController = require('../controllers/song');

router.get('/search', songController.searchSongFromQuery);
router.get('/:commontrack_id', songController.getSongFromId);
router.get('/artist/:id', songController.getArtistFromId);


module.exports = router