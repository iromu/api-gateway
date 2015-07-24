'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('GET /sampleservice/hello', function () {

  function respondWithObject(res) {
    res.body.should.be.instanceof(Object);
    res.body.should.not.be.an.instanceOf(Array);
    res.should.be.json;

    var sampleservice = res.body;

    if (!('message' in  sampleservice)) throw new Error("missing message key");
    if (!('version' in sampleservice)) throw new Error("missing version key");

    sampleservice.message.should.equal('Hello world');
    sampleservice.version.should.equal('2.0.0');
  }

  it('should respond with JSON hello object version 2.0.0 querystring', function (done) {
    request(app)
      .get('/sampleservice/hello?X-Api-Version=2.0.0')// case sensitive
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(respondWithObject)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it('should respond with JSON hello object version 2.0.0 using headers', function (done) {
    request(app)
      .get('/sampleservice/hello')
      .set({
        'x-Api-VeRsion': '2.0.0' // case insensitive
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(respondWithObject)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });
});

