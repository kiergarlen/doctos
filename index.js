var express = require('express');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtratJwt;
var secret = '30dd4e63d8e077faf6173bedf47b68cbfba5505013cbbed2a9fe80b0f10fef5d';
var port = 3000;
var Schema = mongoose.Schema;
var uri = 'mongodb://localhost:27017/documents';
var config = require('./config/config');
var User = require('./app/models/user');
require('./config/passport')(passport);
var apiRoutes = express.Router();





// var options = {};

// options.jwtFromRequest = ExtractJwt.formAuthHeader();
// options.secretOrKey = 'mySecretKey';
// options.issuer = 'my-cool-domain.com';
// options.audience = 'your-site.com';

/*
var documentsSchema = new Schema({
    'status': {
      'type': String,
      'enum': [
        'Acuse original',
        'Acuse vía correo electrónico',
        'Acuse duplicado',
        'Copia del acuse original',
        'Acuse original en área receptora',
        'Cancelado',
        'No definido'
      ]
    },
    'comment': String,
    'entryUser': String,
    'reception': {
      'controlNumbers': Array,
      'date': {'type': Date, 'default': Date.now},
      'office': String,
      'receptionist': String,
      'url': String,
      'subject': String,
      'contents': String
    },
    'response': {
      'date': {'type': Date},
      'number': String,
      'senderOrganization': String,
      'sender': String
    },
    'score': Number
  });
*/
// passport.use(new JwtStrategy(options, function(jwt_payload, done) {
//   User.findOne({
//     id: jwt_payload_sub
//   }, function(err, user) {
//     if (err) {
//       return done(err, false);
//     }
//     if (user) {
//       done(null, user);
//     } else {
//       done(null, false);
//     }
//   });
// }));

// app.post('/profile',  passport.authenticate('jwt', {session: false}), function(req, res) {
//   res.send(req.user.profile);
// })


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(passport.initialize());


mongoose.connect(config.database);

apiRoutes.post('/register', function(req, res) {
  if (!req.body.email || !req.body.password) {
    res.json({success: false, message: 'Please entar an email and password to register'});
  } else {
    var newuser = new User({
      email: req.body.email,
      password: req.body.password
    });

    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, message: 'Email already taken'});
      }
      res.json({success: true, message: 'great success!'});
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
      res.send({success: false, message: 'Authentication failed. User not found'});
    } else {
      user.comparePassword(req.bosy.password, function(err, isMatch) {
        if (isMatch && !err) {
          var token = jwt.sign(user, config.secret, {
            expiresIn: 100800
          });
          res.json({success: true, token: 'JWT ' + token});
        } else{
          res.send({success: false, message: 'Authentication failed. Password not found'});
        }
      });
    }
  });
});

apiRoutes.get('/dashboard', passport.authenticate('jwt', {session: false}), function(req, res) {
  res.send('It worked. User id: ' + req.user._id);
});

app.use('/api', apiRoutes);

app.get('/', function(req, res, err) {
  res.send('this is your homepage');
});


// app.use(express.static('public'));
// app.get('/', function(req, res) {
//   var basicTemplate = [
//     '<form role="form" name="searchForm">',
//     '<input type="text name="searchTerms">',
//     '<br>',
//     '<button type="submit" value="Buscar">Buscar</button>',
//     '</form>'
//   ].join('');
//   res.send(basicTemplate);
// });

app.post('/api/v1/login', function(req, res) {
  var username = req.body.username;
  var userpass = req.body.userpass;
  mongodb.MongoClient.connect(uri, function(error, db) {
    if (error) {
      console.log('ERROR ' + error);
      // process.exit(1);
    }

    db.collection('users').find(
      {username: username},
      {password: userpass}
    ).toArray(function(error, docs) {
      if (error) {
        console.log('ERROR ' + error);
      }
      res.send(JSON.stringify(docs));
    });
  });
});

app.post('/api/v1/search', function(req, res) {
  var searchedText = req.body.term;
  mongodb.MongoClient.connect(uri, function(error, db) {
    if (error) {
      console.log('ERROR ' + error);
    }

    db.collection('docs').find(
      {$text: {$search: searchedText}},
      {
          'status': 1,
          'response': 1,
          'reception.subject': 1,
          'reception.url': 1,
          'score': {$meta:'textScore'}
      }
    )
    .sort({score:{$meta:'textScore'}})
    // .limit(50)
    .toArray(function(error, docs) {
      if (error) {
        console.log('ERROR ' + error);
      }

      // console.log('Found docs');
      // docs.forEach(function(doc) {
      //   console.log(JSON.stringify(doc));
      // });
      res.send(JSON.stringify(docs));
    });
  });
});

app.get('/api/v1/document/:documentId', function(req, res) {
  var documentId = req.params.documentId;
  mongodb.MongoClient.connect(uri, function(error, db) {
    if (error) {
      console.log('ERROR ' + error);
    }

    db.collection('docs').findOne({_id: documentId})
    .toArray(function(error, docs) {
      if (error) {
        console.log('ERROR ' + error);
      }
      res.send(JSON.stringify(docs[0]));
    });
  });
});

app.get('/api/v1/status/:statusId', function(req, res) {
  var statusId = req.params.statusId;
  mongodb.MongoClient.connect(uri, function(error, db) {
    if (error) {
      console.log('ERROR ' + error);
    }

    db.collection('status').findOne({_id: statusId})
    .toArray(function(error, docs) {
      if (error) {
        console.log('ERROR ' + error);
      }
      res.send(JSON.stringify(docs[0]));
    });
  });
});

app.get('/api/v1/status', function(req, res) {
  mongodb.MongoClient.connect(uri, function(error, db) {
    if (error) {
      console.log('ERROR ' + error);
    }

    db.collection('status').find()
    .toArray(function(error, docs) {
      if (error) {
        console.log('ERROR ' + error);
      }
      res.send(JSON.stringify(docs));
    });
  });
});

app.listen(port, function() {
  console.log('Server listening on port 3000');
});

/*
var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var mongodb = require('mongodb');
var uri = 'mongodb://localhost:27017/example';
mongodb.MongoClient.connect(uri, function(error, db) {
  if (error) {
    console.log(error);
    process.exit(1);
  }

  db.collection('sample').insert({ x:1 }, function(error, result) {
    if (error) {
      console.log(error);
      process.exit(1);
    }

    db.collection('sample').find().toArray(function(error, docs) {
      if (error) {
        console.log(error);
        process.exit(1);
      }

      console.log('Found docs:');
      docs.forEach(function(doc) {
        console.log(JSON.stringify(doc));
      });
      process.exit(0);
    });
  });
});
*/
