const express = require('express')
const compression = require('compression')
const app = express()
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const port = 3000
const Schema = mongoose.Schema
const config = require('./config/config')

require('./config/passport')(passport)
require('./app/routes/routes')(app)

mongoose.connect(config.database)

app.use(compression())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(express.static('public'))

app.listen(port, () => {
  console.log('Server listening on port ' + port)
})
