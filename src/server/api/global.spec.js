'use strict';

var fs = require('fs');
var path = require('path');

var should = require('should');
var request = require('supertest');
var Service = require('./service/service.model.js');

before(function (done) {
  console.log('global setup');

  var swaggerModel = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/seed/sampleservice-swagger.json')));

  swaggerModel.info.version = '2.0.3';
  swaggerModel.host = 'localhost:9000/';
  swaggerModel.basePath = '/api/v203';

  var sampleServiceSwagger = JSON.stringify(swaggerModel);

  Service.find({}).remove(function () {
    Service.create({
        name: 'Sample Service',
        code: 'sampleservice',
        public: true,
        hits: 10,
        latestVersion: '2.1.0',
        endpoints: [
          {uri: '/api/samples/v101', hits: 4, apiVersion: '1.0.1'},
          {
            uri: '/api/samples/v200',
            apiBaseUrl: '/api/samples/v200/swagger.json',
            hits: 1,
            apiVersion: '2.0.0'
          },
          {uri: '/api/samples/v203', apiDoc: sampleServiceSwagger, hits: 3, apiVersion: '2.0.3'},
          {
            uri: '/api/samples/v210',
            apiBaseUrl: '/api/samples/v210/swagger.json', hits: 2, apiVersion: '2.1.0'
          }
        ]
      }, {
        name: 'Private',
        code: 'private',
        public: false,
        hits: 10,
        latestVersion: '2.1.0',
        endpoints: [
          {uri: '/api/samples/v101', hits: 4, apiVersion: '1.0.1'},
          {uri: '/api/samples/v200', hits: 1, apiVersion: '2.0.0'},
          {uri: '/api/samples/v203', hits: 3, apiVersion: '2.0.3'},
          {uri: '/api/samples/v210', hits: 2, apiVersion: '2.1.0'}
        ]
      },
      function () {
        console.log('global spec finished populating services and endpoints');
        done();
      }
    );
  });
});
