// routes.js
var passport = require('passport');
var express = require('express');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var User = require('./models/user');
var Document = require('./models/document');

// Export the routes for our app to use
module.exports = function(app) {
  app.use(passport.initialize());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  require('../config/passport')(passport);

  var apiRoutes = express.Router();

  apiRoutes.post('/register', function(req, res) {
    if (!req.body.email || !req.body.password) {
      res.json({success: false, message: 'Please enter email and password'});
    } else {
      var newUser = new User({
        email: req.body.email,
        password: req.body.password
      });

      newUser.save(function(err) {
        if (err) {
          return res.json({success: false, message: 'Email already exists'});
        }
        res.json({success: true, message: 'Successfully created new user'});
      });
    }
  });

  apiRoutes.post('/authenticate', function(req, res) {
    User.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        res.send({success: false, message: 'Authentication failed, User not found'});
      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.sign(user, config.secret, {
              expiresIn: 3600
            });
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.send({success: false, message: 'Authentication failed. Password mismatch'});
          }
        });
      }
    });
  });

  apiRoutes.get('/dashboard', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      res.send('It worked! User id is: ' + req.user._id);
    }
  );

  // );
  // TODO: When JWT authentication is implemented, add auth middleware
  // apiRoutes.post('/search', passport.authenticate('jwt', {session: false}),
  apiRoutes.post('/search',
    function(req, res) {
      var searchedText = req.body.term;
      Document.find(
        {$text: {$search: searchedText}},
        {score: {$meta: 'textScore'}}
      )
      .sort({score:{$meta: 'textScore'}})
      .exec(function(err, docs) {
        if (err) {
          res.send({success: false, message: 'Query failed. Error: ' + err});
        }
        res.send(JSON.stringify(docs));
      });
    }
  );

  app.use('/api', apiRoutes)
}
