var express = require('express');
var app = express();
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var Schema = mongoose.Schema;

var uri = 'mongodb://localhost:27017/documents';

app.use(express.static('app'));
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


app.get('/api/v1/search/:term', function(req, res) {
  var searchedText = req.params.term;
  mongodb.MongoClient.connect(uri, function(error, db) {
    if (error) {
      console.log('ERROR ' + error);
    }

    db.collection('docs').find(
      {$text: {$search: searchedText}},
      {score: {$meta:'textScore'}}
    )
    .sort({score:{$meta:'textScore'}})
    .limit(50)
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

app.listen(3000, function() {
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
