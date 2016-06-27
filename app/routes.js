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
              expiresIn: 86400
            });
            res.json({success: true, token: 'JWT ' + token});
          } else {
            res.send({success: false, message: 'Authentication failed. Password mismatch'});
          }
        });
      }
    });
  });

  apiRoutes.get('/user', passport.authenticate('jwt', {session: false}),
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

  apiRoutes.get('/user/:userId', passport.authenticate('jwt', {session: false}),
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

  apiRoutes.get('/dashboard', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      res.send('It worked! User id is: ' + req.user._id);
    }
  );

  // TODO: When JWT authentication is implemented, add auth middleware
  // apiRoutes.post('/search',
  apiRoutes.post('/search', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      var searchedText = req.body.term;
      Document.find(
        {$text: {$search: searchedText}},
        {score: {$meta: 'textScore'}}
      )
      .select('status response reception.subject reception.url')
      .sort({score:{$meta: 'textScore'}})
      .exec(function(err, docs) {
        if (err) {
          res.send({success: false, message: 'Query failed. Error: ' + err});
        }
        res.send(JSON.stringify(docs));
      });
    }
  );

  // TODO: When JWT authentication is implemented, add auth middleware
  // apiRoutes.get('/document',
  apiRoutes.get('/document', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Document.find({}, function(err, docs) {
        if (err) {
          res.send({success: false, message: 'Not found'});
        }
        res.json(docs);
      });
    }
  );

  // TODO: When JWT authentication is implemented, add auth middleware
  // apiRoutes.get('/document/:documentId',
  apiRoutes.get('/document', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Document.findOne({_id: req.params.documentId}, function(err, doc) {
        if (err) {
          res.send({success: false, message: 'Not found'});
        }
        res.json(doc);
      });
    }
  );

  // TODO: When JWT authentication is implemented, add auth middleware
  // apiRoutes.post('/document',
  apiRoutes.post('/document', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      var doc = new Document();
      // doc = req.body.doc;
      doc.entryUser = req.user._id;

      doc.save(function(err) {
        if (err) {
          res.send({success: false, message: 'Error: ' + err});
        }
        res.json({success: true, message: 'Document saved'});
      });
    }
  );

  // TODO: When JWT authentication is implemented, add auth middleware
  // apiRoutes.post('/document/:documentId',
  apiRoutes.post('/document/:documentId', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Document.findOne({_id: req.params.documentId}, function(err, doc) {
        if (err) {
          res.send({success: false, message: 'Error: ' + err});
        }

        doc = req.body;

        doc.save(function(err) {
          if (err) {
            res.send({success: false, message: 'Error: ' + err});
          }
          res.json({success: true, message: 'Document updated'});
        });
      });
    }
  );

  // TODO: When JWT authentication is implemented, add auth middleware
  // apiRoutes.delete('/document/:documentId',
  apiRoutes.delete('/document/:documentId', passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Document.findOneAndRemove({_id: req.params.documentId}, function(err, doc) {
        if (err) {
          res.send({success: false, message: 'Error: ' + err});
        }
        res.json({success: true, message: 'Document removed'});
      });
    }
  );

  app.use('/api', apiRoutes)
}
