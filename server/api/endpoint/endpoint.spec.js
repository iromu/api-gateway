'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

require('../../config/seed');

describe('GET /sampleservice/hello', function () {

  function respondWithObject(res) {
    res.body.should.be.instanceof(Object);
    res.body.should.not.be.an.instanceOf(Array);
    res.should.be.json;

    if (!('message' in res.body)) throw new Error("missing version key");
    if (!('version' in res.body)) throw new Error("missing version key");

    res.body.message.should.equal('Hello world');
  }

  it('should respond with JSON hello object version 2.0.0', function (done) {
    request(app)
      .get('/sampleservice/hello?X-Api-Version=2.0.0')
      .set('Accept', 'application/json')
      .set('X-Api-Version', '2.0.0')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(respondWithObject)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});
