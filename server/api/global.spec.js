'use strict';

var should = require('should');
var request = require('supertest');
var Service = require('./service/service.model');

before(function (done) {
  console.log('global setup');

  Service.find({}).remove(function () {
    Service.create({
        name: 'Sample Service',
        code: 'sampleservice',
        public: true,
        hits: 10,
        latestVersion: '2.1.0',
        endpoints: [
          {uri: 'http://localhost:9000/api/samples/v1', apiVersion: '1.0.1'},
          {uri: 'http://localhost:9000/api/samples/v2', apiVersion: '2.0.0'},
          {uri: 'http://localhost:9000/api/samples/v2', apiVersion: '2.0.3'},
          {uri: 'http://localhost:9000/api/samples/v2', apiVersion: '2.1.0'}
        ]
      }, {
        name: 'Swagger Petstore',
        code: 'swaggerpetstore',
        public: true,
        hits: 0,
        endpoints: [
          {uri: 'http://petstore.swagger.io/v2', apiVersion: '2'}
        ]
      },
      function () {
        console.log('global spec finished populating services and endpoints');
        done();
      }
    );
  });
});
