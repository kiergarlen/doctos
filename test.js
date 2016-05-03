var app = require('./server');
var assert = require('assert');
var superagent = require('superagent');

describe('server', function() {
  var server;

  beforeEach(function() {
    server = app().listen(3000);
  });

  afterEach(function() {
    server.close();
  });

  it('prints out "Hello, world" when the user goes to /', function(done) {
    superagent.get('http://localhost:3000/', function(error, res) {
      assert.ifError(error);
      assert.equal(res.status, 200);
      assert.equal(res.text, 'Hello, world!');
      done();
    });
  });
});

/*
assert = require('assert');

describe('my feature', function() {
  it('works', function() {
    assert.equal('A', 'A');
  });

  it('fails gracefully', function() {
    assert.throws(function() {
      throw 'Error!';
    });
  });
});

describe('my other feature', function() {
  it('async', function(done) {
    setTimeout(function() {
      done();
    }, 25);
  });
});
*/
