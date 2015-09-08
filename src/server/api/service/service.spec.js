'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

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
        res.body.should.have.length(1);
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

        var sampleservice = res.body[0];
        if (!('latestVersion' in sampleservice)) throw new Error('missing latestVersion key');
        if (!('endpoints' in sampleservice)) throw new Error('missing endpoints key');

        var endpoints = sampleservice.endpoints;
        endpoints.should.have.length(4);

        endpoints.forEach(function (endpoint) {
          if (!('apiVersion' in  endpoint)) throw new Error('endpoint missing apiVersion key');
          if (!('uri' in endpoint)) throw new Error('endpoint missing uri key');
        });

        done();
      });
  });

  it('should respond with typeahead array', function (done) {
    request(app)
      .get('/api/services/typeahead?code=er')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.should.have.length(1);
        res.body.should.eql(['sampleservice']);

        done();
      });
  });

  it('should respond with not found', function (done) {
    request(app)
      .get('/api/services?code=er')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);
        res.body.should.be.instanceof(Array);
        res.body.should.have.length(0);

        done();
      });
  });

  it('should respond with sampleservice by code', function (done) {
    request(app)
      .get('/api/services/sampleservice')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);

        res.body.should.be.instanceof(Object);
        res.body.should.not.be.an.instanceOf(Array);
        res.should.be.json;

        var sampleservice = res.body;

        if (!('code' in  sampleservice)) throw new Error('missing code key');
        res.body.code.should.equal('sampleservice');

        done();
      });
  });

  it('should respond with version array from sampleservice', function (done) {
    request(app)
      .get('/api/services/sampleservice/versioning')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);

        res.body.should.be.instanceof(Array);
        res.body.should.have.length(4);
        res.body.should.eql(['1.0.1', '2.0.0', '2.0.3', '2.1.0']);

        done();
      });
  });
});
