require('dotenv').config()
const express = require('express'),
    app = express(),
    port = process.env.PORT,
    mongoose = require('mongoose'),
    cors = require('cors')
    songRoute = require('./routes/song')

mongoose.connect('mongodb://localhost:27017/musicsz', {useNewUrlParser:true})
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

app.use('/', songRoute)

app.listen(port, function () {
    console.log('Listening on port:', port)
})