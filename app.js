require('dotenv').config()
const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    cors = require('cors'),
    routerSong = require('./routes/song'),
    routerUser = require('./routes/user')

mongoose.connect('mongodb://localhost:27017/musicsz', {useNewUrlParser:true})
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/songs', routerSong)

app.use('/users', routerUser)

app.listen(port, function () {
    console.log('Listening on port:', port)
})