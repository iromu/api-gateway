/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _ = require('lodash');

var User = require('../api/user/user.model');
var Service = require('../api/service/service.model');

User.find({}).remove(function () {
  User.create({
      provider: 'local',
      name: 'Test User',
      email: 'test@test.com',
      password: 'test'
    }, {
      provider: 'local',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin'
    }, function () {
      console.log('finished populating users');
    }
  );

  for (var i = 0; i < 500; i++) {
    User.create({
      provider: 'local',
      name: 'Test User ' + i,
      email: i + 'test@test.com',
      password: 'test'
    });
  }

});

Service.find({}).remove(function () {
  Service.create({
      name: 'Sample Service',
      code: 'sampleservice',
      public: true,
      example: true,
      hits: 10,
      latestVersion: '2.1.0',
      defaultHeaders: [
        {name: 'api_key', value: 'test-key'}
      ],
      endpoints: [
        {
          uri: 'http://localhost:9000/api/samples/v101', apiDoc: 'swagger.json', hits: 4, apiVersion: '1.0.1'
        },
        {uri: 'http://localhost:9000/api/samples/v200', apiDoc: 'swagger.json', hits: 1, apiVersion: '2.0.0'},
        {uri: 'http://localhost:9000/api/samples/v203', apiDoc: 'swagger.json', hits: 3, apiVersion: '2.0.3'},
        {
          uri: 'http://localhost:9000/api/samples/v210',
          apiDoc: 'swagger.json',
          hits: 2,
          apiVersion: '2.1.0',
          headers: [
            {name: 'newextraapi_key', value: 'newtest-key'}
          ]
        }
      ]
    }, {
      name: 'Swagger Petstore',
      code: 'swaggerpetstore',
      public: true,
      hits: 0,
      latestVersion: '2',
      endpoints: [
        {
          uri: 'http://petstore.swagger.io/v2',
          apiVersion: '2',
          apiDoc: 'http://petstore.swagger.io/v2/swagger.json',
          headers: [
            {name: 'api_key', value: 's5hredf5hy41er8yhee58'}
          ]
        }
      ]
    }, {
      name: '\';--have i been pwned?',
      code: 'haveibeenpwned',
      public: true,
      hits: 0,
      latestVersion: '2',
      endpoints: [
        {
          uri: 'https://haveibeenpwned.com/api/v2/',
          apiVersion: '2',
          apiDoc: ''
        }
      ]
    },
    function () {
      console.log('finished populating services and endpoints');
    }
  );
});


