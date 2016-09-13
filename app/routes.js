// routes.js
var passport = require('passport');
var express = require('express');
var config = require('../config/config');
var jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var mongodb = require('mongodb');
var multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/pdf/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({storage: storage}).single('file');

var User = require('./models/user');
var Status = require('./models/status');
var ReceiverType = require('./models/receivertype');
var Respondent = require('./models/respondent');
var Document = require('./models/document');

module.exports = function(app) {
  app.use(passport.initialize());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());

  require('../config/passport')(passport);

  var api = express.Router();

  api.post(
    '/register',
    function(req, res) {
      if (!req.body.email || !req.body.password) {
        res.json({success: false, message: 'Please enter email and password'});
      } else {
        var newUser = new User({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          role: 'Guest'
        });

        newUser.save(function(err) {
          if (err) {
            return res.json({success: false, message: 'Email already exists'});
          }
          res.json({success: true, message: 'Successfully created new user'});
        });
      }
    });

  api.post(
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

  api.get(
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

  api.get(
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

  api.post(
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

  api.get(
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

  api.get(
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

  api.post(
    '/document',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      if (req.body._id) {
        var id = req.body._id;
        delete req.body._id;
        Document.findByIdAndUpdate(
          id,
          {$set: req.body},
          function(err, doc) {
          if (err) {
            res.send({success: false, message: 'Not found'});
          }
          res.json({success: true, message: doc._id});
        });
      } else {
        var doc = new Document(req.body);
        doc.save(function(err) {
          if (err) {
            res.send({success: false, message: 'Error: ' + err});
          } else {
            res.json({success: true, message: doc._id});
          }
        });
      }
    }
  );

////
///router.post(
///'/uploads',
///function (req, res, next) {
///if (!authorized) {
///res.send(403);
///} else {
///next();
///}
///},
///multer({ dest: '/uploads/' }),
///function (req, res, next) {
///// whatever you were planning to do.
///});

  api.post(
    '/document/upload/:documentId',
    // passport.authenticate('jwt', {session: false}),
    function(req, res) {
      upload(req, res, function (err) {
        if (err) {
          res.send({success: false, message: err});
          return;
        }
        res.send({success: true, message: 'File uploaded'});
      });
    }
  );

  api.delete(
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

  api.get(
    '/status',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Status.find({}, function(err, statusList) {
        if (err) {
          res.send({success: false, message: 'Not found'});
          throw err;
        }
        res.json(statusList);
      });
    }
  );

  api.get(
    '/receiver/type',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      ReceiverType.find({}, function(err, receiverTypes) {
        if (err) {
          res.send({success: false, message: 'Not found'});
          throw err;
        }
        res.json(receiverTypes);
      });
    }
  );

  api.get(
    '/respondent',
    passport.authenticate('jwt', {session: false}),
    function(req, res) {
      Respondent.find({}, function(err, respondents) {
        if (err) {
          res.send({success: false, message: 'Not found'});
          throw err;
        }
        res.json(respondents);
      });
    }
  );

  api.get(
    '/profile',
    passport.authenticate('jwt', {session: false}),
    function (req, res, next) {
      console.log(req.file);
      // req.file is the `avatar` file
      // req.body will hold the text fields, if there were any
    }
  )

  app.use('/api', api);
}
