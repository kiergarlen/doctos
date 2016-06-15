// routes.js
var passport = require('passport');
var express = require('express');
var config = require('../config/config');
var jwt = require('jsonwebtoken');

var User = require('./models/user');

// Export the routes for our app to use
module.exports = function(app) {
  app.use(passport.initialize());

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

  //Protect dashboard route with JWT
  apiRoutes.get('/dashboard', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      res.send('It worked! User id is: ' + req.user._id);
    }
  );

  //Set Url for API group routes
  app.use('/api', apiRoutes)
}
