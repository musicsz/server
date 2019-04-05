const router = require('express').Router()
const Controller = require('../controllers/song')

router.post('/getVideo', Controller.getVids)

module.exports = router