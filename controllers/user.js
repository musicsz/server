const user = require('../models/user')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
const jwt = require('jsonwebtoken')
require('dotenv').config()
console.log(process.env.CLIENT_ID)
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
        console.log('masuk ke login')
        console.log(req.body)
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
                console.log(err)
                // if (err.errors.message) {
                //     res.status(404).json(err.errors.message)
                // }
                // else {
                //     res.status(500).json(err)
                // }
            })
    }

    static signInGoogle(req, res) {
        // console.log('masuk ke google')
        // console.log(req.body)
        // console.log(process.env.CLIENT_ID)
        var newEmail = ''
        client.verifyIdToken({
            idToken: req.body.idToken,
            audience: process.env.CLIENT_ID
        })
            .then(function (ticket) {
                console.log(ticket)
                console.log('masuk ke then 1')
                newEmail = ticket.getPayload().email
                return user.findOne({
                    email: newEmail
                })
            })
            .then(function (userLogin) {
                console.log('masuk ke then 2')
                console.log(userLogin)
                if (!userLogin) {
                    return user.create({
                        email: newEmail,
                        password: 'password'
                    })
                } else {
                    return userLogin
                }
            })
            .then(function (newUser) {
                console.log('masuk ke then 3')
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
                console.log(err)
                res.status(500).json(err)
            })
    }
}

module.exports = User