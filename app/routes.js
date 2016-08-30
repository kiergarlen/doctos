// routes.js
var passport = require('passport');
var express = require('express');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');

var User = require('./models/user');
var Document = require('./models/document');

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  require('../config/passport')(passport);

  var apiRoutes = express.Router();

  apiRoutes.post(
    '/register',
    function(req, res) {
      if (!req.body.email || !req.body.password) {
        res.json({success: false, message: 'Please enter email and password'});
      } else {
        var newUser = new User({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          role: req.body.role
        });

        newUser.save(function(err) {
          if (err) {
            return res.json({success: false, message: 'Email already exists'});
          }
          res.json({success: true, message: 'Successfully created new user'});
        });
      }
    });

  apiRoutes.post(
    '/authenticate',
    function(req, res) {
      User.findOne({
        email: req.body.email
      }, function(err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          res.send({success: false, message: 'Not found'});
        } else {
          user.comparePassword(req.body.password, function(err, isMatch) {
            if (isMatch && !err) {
              var token = jwt.sign(user, config.secret, {
                expiresIn: 86400
              });
              res.json({success: true, token: 'JWT ' + token});
            } else {
              res.send({success: false, message: 'Authentication failed.'});
            }
          });
        }
      });
    });

  apiRoutes.get(
    '/user',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      User.find({}, function(err, users) {
        if (err) {
          throw err;
        }
        if (!user) {
          res.send({success: false, message: 'Users not found'});
        } else {
          res.json(users);
        }
      });
    }
  );

  apiRoutes.get(
    '/user/:userId',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      User.findOne({_id: req.params.userId}, function(err, user) {
        if (err) {
          throw err;
        }
        if (!user) {
          res.send({success: false, message: 'User not found'});
        } else {
          res.json(user);
        }
      });
    }
  );

  apiRoutes.get(
    '/dashboard',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      res.send('It worked! User id is: ' + req.user._id);
    }
  );

  apiRoutes.post(
    '/search',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      var searchedText = req.body.term;
      Document.find(
        {$text: {$search: searchedText}},
        {score: {$meta: 'textScore'}}
      )
      .select('_id number status receiver reception subject signDate')
      .sort({score:{$meta: 'textScore'}})
      .exec(function(err, docs) {
        if (err) {
          res.send({success: false, message: 'Query failed. Error: ' + err});
        }
        res.send(JSON.stringify(docs));
      });
    }
  );

  apiRoutes.get(
    '/document',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Document.find({}, function(err, docs) {
        if (err) {
          res.send({success: false, message: 'Not found'});
        }
        res.json(docs);
      });
    }
  );

  apiRoutes.get(
    '/document/:documentId',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Document.findOne({_id: req.params.documentId}, function(err, doc) {
        if (err) {
          res.send({success: false, message: 'Not found'});
        }
        res.json(doc);
      });
    }
  );

  apiRoutes.post(
    '/document',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      var doc = new Document(req.body);
      doc.save(function(err) {
        if (err) {
          res.send({success: false, message: 'Error: ' + err});
        } else {
          res.json({success: true, message: doc._id});
        }
      });
    }
  );

  // apiRoutes.post(
  //   '/document/:documentId',
  //   passport.authenticate('jwt', {session: false}),
  //   function(req, res) {
  //     Document.findOne({_id: req.params.documentId},
  //       function(err, doc) {
  //         if (err) {
  //           res.send({success: false, message: 'Error: ' + err});
  //         } else {
  //           doc = req.body;
  //           doc.save(
  //             function(err) {
  //               if (err) {
  //                 res.send({success: false, message: 'Error: ' + err});
  //               }
  //               res.json({success: true, message: req.params.documentId});
  //             }
  //           );
  //         }
  //       }
  //     );
  //   }
  // );

  apiRoutes.post(
    '/document',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      var newDoc = new Document(req.body);
      Document.findOneAndUpdate(
        {_id: req.body._id},
        newDoc,
        {new: true, upsert: true},
        function(err, doc) {
          if (err) {
            res.send({success: false, message: 'Error: ' + err});
          } else {
            res.json({success: true, message: doc._id});
          }
        }
      );
    }
  );

  apiRoutes.delete(
    '/document/:documentId',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Document.findOneAndRemove(
        {_id: req.params.documentId},
        function(err, doc) {
          if (err) {
            res.send({success: false, message: 'Error: ' + err});
          }
          res.json({success: true, message: 'Document removed'});
        }
      );
    }
  );

  app.use('/api', apiRoutes)
}
