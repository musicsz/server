require('dotenv').config()
const express = require('express'),
    app = express(),
    port = process.env.PORT,
    mongoose = require('mongoose'),
    cors = require('cors')

mongoose.connect('mongodb://localhost:27017/musicsz', {useNewUrlParser:true})
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(cors())

app.listen(port, function () {
    console.log('Listening on port:', port)
})