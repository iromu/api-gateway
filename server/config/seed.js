/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

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
});

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
      console.log('finished populating services and endpoints');
    }
  );
});
