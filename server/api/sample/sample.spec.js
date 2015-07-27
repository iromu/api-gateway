'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

function respondWithObject(res) {
  res.body.should.be.instanceof(Object);
  res.body.should.not.be.an.instanceOf(Array);
  res.should.be.json;

  if (!('message' in res.body)) throw new Error("missing version key");
  if (!('version' in res.body)) throw new Error("missing version key");

  res.body.message.should.equal('Hello world');
}

var shouldRespondWithVersion = function (versionUrl, version) {
  it('should respond with JSON object', function (done) {
    request(app)
      .get('/api/samples/' + versionUrl + '/hello')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(respondWithObject)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.version.should.equal(version);
        done();
      });
  });
};


describe('GET /api/samples/v101/hello', function () {

  var versionUrl = 'v101';
  var version = '1.0.1';
  shouldRespondWithVersion(versionUrl, version);

});

describe('GET /api/samples/v200/hello', function () {

  var versionUrl = 'v200';
  var version = '2.0.0';
  shouldRespondWithVersion(versionUrl, version);

});

describe('GET /api/samples/v203/hello', function () {

  var versionUrl = 'v203';
  var version = '2.0.3';
  shouldRespondWithVersion(versionUrl, version);

});

describe('GET /api/samples/v210/hello', function () {

  var versionUrl = 'v210';
  var version = '2.1.0';
  shouldRespondWithVersion(versionUrl, version);

});
