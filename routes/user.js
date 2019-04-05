const router = require('express').Router(),
controllerUser = require('../controllers/user')

router.post('/signin', controllerUser.signIn)

router.post('/signup', controllerUser.signUp)

router.post('/googlesignin', controllerUser.signInGoogle)


module.exports = router