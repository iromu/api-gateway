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

describe('GET /api/samples/v1/hello', function () {


  it('should respond with JSON object', function (done) {
    request(app)
      .get('/api/samples/v1/hello')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(respondWithObject)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

describe('GET /api/samples/v2/hello', function () {

  it('should respond with JSON object', function (done) {
    request(app)
      .get('/api/samples/v2/hello')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(respondWithObject)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});
