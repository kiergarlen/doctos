
var express = require('express');
var app = express();

app.use(express.static('public'));

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
