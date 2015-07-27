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
          {uri: 'http://localhost:9000/api/samples/v101', hits: 4, apiVersion: '1.0.1'},
          {uri: 'http://localhost:9000/api/samples/v200', hits: 1, apiVersion: '2.0.0'},
          {uri: 'http://localhost:9000/api/samples/v203', hits: 3, apiVersion: '2.0.3'},
          {uri: 'http://localhost:9000/api/samples/v210', hits: 2, apiVersion: '2.1.0'}
        ]
      },{
        name: 'Private',
        code: 'private',
        public: false,
        hits: 10,
        latestVersion: '2.1.0',
        endpoints: [
          {uri: 'http://localhost:9000/api/samples/v101', hits: 4, apiVersion: '1.0.1'},
          {uri: 'http://localhost:9000/api/samples/v200', hits: 1, apiVersion: '2.0.0'},
          {uri: 'http://localhost:9000/api/samples/v203', hits: 3, apiVersion: '2.0.3'},
          {uri: 'http://localhost:9000/api/samples/v210', hits: 2, apiVersion: '2.1.0'}
        ]
      },
      function () {
        console.log('global spec finished populating services and endpoints');
        done();
      }
    );
  });
});
