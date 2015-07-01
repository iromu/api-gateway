'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

require('../../config/seed');

describe('GET /api/services', function () {

  it('should respond with JSON array', function (done) {
    request(app)
      .get('/api/services')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.should.have.length(2);
        done();
      });
  });

  it('should respond with public services', function (done) {
    request(app)
      .get('/api/services?public=true')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.should.have.length(2);
        done();
      });
  });

  it('should respond with sample service', function (done) {
    request(app)
      .get('/api/services?code=sampleservice')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.should.have.length(1);
        done();
      });
  });
});
