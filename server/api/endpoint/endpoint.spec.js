'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var _ = require('lodash');

describe('GET /sampleservice/hello', function () {

  function cookieResponse(res) {
    var cookies = res.header['set-cookie'];
    cookies.forEach(function (cookie) {
      if (_.startsWith(cookie, 'echo-token-response=')) {
        cookie.should.startWith('echo-token-response=12345;');
        return;
      }
    });
  }

  function shouldRespondWithVersion(target, version) {
    version = version || target;
    it('should respond with hello world version ' + version, function (done) {
      request(app)
        .get('/sampleservice/hello?X-Api-Version=' + target)
        .set({
          'Echo-Header': 'new'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .set('Cookie', 'echo-token=12345')
        .expect('Echo-Header-Response', 'new')
        .expect(cookieResponse)
        .expect(respondWithObject)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.version.should.equal(version);
          done();
        });
    });
  }

  function respondWithObject(res) {
    res.body.should.be.instanceof(Object);
    res.body.should.not.be.an.instanceOf(Array);
    res.should.be.json;

    var sampleservice = res.body;

    if (!('message' in  sampleservice)) throw new Error("missing message key");
    if (!('version' in sampleservice)) throw new Error("missing version key");

    sampleservice.message.should.equal('Hello world');
  }

  it('should respond with hello world version 2.0.0 using querystring', function (done) {
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

  it('should respond with hello world version 2.0.0 using headers', function (done) {
    request(app)
      .get('/sampleservice/hello')
      .set({
        'x-Api-VeRsion': '2.0.0'// case insensitive
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(respondWithObject)
      .end(function (err) {
        if (err) return done(err);
        done();
      });
  });

  it('should respond with swagger config 2.0.0 using querystring', function (done) {
    request(app)
      .get('/sampleservice/swagger.json?X-Api-Version=2.0.0')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) return done(err);

        res.body.should.be.instanceof(Object);
        res.body.should.not.be.an.instanceOf(Array);
        res.should.be.json;

        if (!('swagger' in  res.body)) throw new Error("missing swagger key");

        res.body.swagger.should.equal('2.0');
        res.body.info.version.should.equal('2.0.0');
        //res.body.host.should.equal('localhost:9000');
        res.body.basePath.should.equal('/sampleservice');

        done();
      });
  });

  shouldRespondWithVersion('1.0.1');
  shouldRespondWithVersion('2.0.3');
  shouldRespondWithVersion('2.0.0');
  shouldRespondWithVersion('2.1.0');
  shouldRespondWithVersion('@LATEST', '2.1.0');

});

