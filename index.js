var express = require('express');
var compression = require('compression');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtratJwt;
var secret = '30dd4e63d8e077faf6173bedf47b68cbfba5505013cbbed2a9fe80b0f10fef5d';
var port = 3000;
var Schema = mongoose.Schema;
var uri = 'mongodb://localhost:27017/documents';
var config = require('./config/config');

require('./config/passport')(passport);
require('./app/routes')(app);

mongoose.connect(config.database);

app.use(compression());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(express.static('public'));

app.listen(port, function() {
  console.log('Server listening on port 3000');
});
