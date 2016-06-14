const express = require('express')
const app = express()
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const JwtStrategy = require('passport-jwt')(Strategy)
const ExtractJwt = require('passport-jwt')(ExtratJwt)
const secret = '30dd4e63d8e077faf6173bedf47b68cbfba5505013cbbed2a9fe80b0f10fef5d'


app.use(session({
  store: new RedisStore({
    url: config.redisStore.url
  }),
  secret: config.redisStore.secret,
  resave: false,
  saveUnitialized: false
}))

app.use(passport.initialize(()))
app.use(passport.session())


// db.oficios.find(
//   {$text: {$search: 'CUENCAS'}},
//   {score: {$meta:'textScore'}}
// )
// .sort({score:{$meta:'textScore'}})
// .limit(50)
// .toArray();

/*
var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var db = require('./db');

passport.use(new Strategy(
  function(username, password, callback) {
    db.users.findByUsername(username, function(err, user {
      if (err) {
        return callback(err);
      }
      if (!user) {
        return callback(null, false);
      }
      if (user.password !== password) {
        return callback(null, false);
      }
      return callback(null, user);
    }))
  })
);

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('express-session')({secret: 'mySecret', resave: false, saveUnitialized: false}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('home', {user: req.user});
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res) {
    res.render('profile', {user: req.user});
  });

app.listen(3000);
*/
// module.exports = function() {
//   var app = express();
//   app.use(express.static('app'));

  // app.get('/', function(req, res) {
  //   res.send('Hello, world!');
  // });


  // app.get('/', function(req, res) {
  //   res.send('Hello, world!');
  // });
  //
  // app.get('/user/:user', function(req, res) {
  //   var response = [
  //     'Page for user ',
  //     req.params.user,
  //     ' with option ',
  //     req.query.option
  //   ].join('');
  //   res.send(response);
  // });

//   return app;
// };
