require('dotenv').config()
const express = require('express'),
    app = express(),
    port = process.env.PORT || 8080,
    mongoose = require('mongoose'),
    cors = require('cors'),
    songs = require('./routes/song')

// mongoose.connect('mongodb://localhost:27017/musicsz', {useNewUrlParser:true})
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.use('/songs', songs)

app.listen(port, function() {
    console.log('Listening on port:', port)
})