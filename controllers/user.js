const

class User {
    static signUp(req, res) {
        user
            .create({
                email: req.body.email,
                password: req.body.password
            })
            .then(function (newUser) {
                res.status(201).json(newUser)
            })
            .catch(function (err) {
                if (err.errors.email) {
                    res.status(400).json(err.errors.email.message)
                }
                else if (err.errors.password) {
                    res.status(400).json(err.errors.password.message)
                }
                else {
                    res.status(500).json(err)
                }
            })
    }

    static signIn(req, res) {
        user
            .findOne({
                email: req.body.email
            })
            .then(function (uLogin) {
                if (!uLogin) {
                    throw new Error({
                        message: 'Username / password wrong'
                    })
                }
                else {
                    if (!decrypt(req.body.password, uLogin.password)) {
                        throw new Error({
                            message: 'Username / password wrong'
                        })
                    }
                    else {
                        let token = jwt.sign({
                            email: uLogin.email,
                            id: uLogin._id
                        }, process.env.SECRET)
                        let obj = {
                            token,
                            id: uLogin._id
                        }
                        res.status(200).json(obj)
                    }
                }
            })
            .catch(function (err) {
                if (err.errors.message) {
                    res.status(404).json(err.errors.message)
                }
                else {
                    res.status(500).json(err)
                }
            })
    }

    static signInGoogle(req, res) {
        var newEmail = ''
        client.verifyIdToken({
            idToken: req.body.id_token,
            audience: process.env.CLIENT_ID
        })
            .then(function (ticket) {
                console.log(ticket)
                newEmail = ticket.getPayload().email
                return User.findOne({
                    email: newEmail
                })
            })
            .then(function (user) {
                console.log(user)
                if (!user) {
                    return User.create({
                        email: newEmail,
                        password: 'password'
                    })
                } else {
                    return user
                }
            })
            .then(function (newUser) {
                let token = jwt.sign({
                    email: newUser.email,
                    id: newUser._id
                }, process.env.SECRET)
                let obj = {
                    token,
                    id: newUser._id
                }
                res.status(200).json(obj)
            })
            .catch(function (err) {
                res.status(500).json(err)
            })
    }
}

module.exports = User