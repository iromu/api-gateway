'use strict';

var should = require('should');
var app = require('../../app');
var Service = require('./service.model.js');

var service = new Service({
});

describe('Service Model', function () {
/*
  before(function (done) {
    Service.remove().exec().then(function () {
      done();
    });
  });

  afterEach(function (done) {
    Service.remove().exec().then(function () {
      done();
    });
  });
*/
  it('should begin with no services', function (done) {
    Service.find({}, function (err, services) {
      services.should.have.length(0);
      done();
    });
  });

  it('should fail when saving a duplicate service', function (done) {
    service.save(function () {
      var serviceDup = new Service(service);
      serviceDup.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  it('should fail when saving without a code', function (done) {
    service.code = '';
    service.save(function (err) {
      should.exist(err);
      done();
    });
  });

});
