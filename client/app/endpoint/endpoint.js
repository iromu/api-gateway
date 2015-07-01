'use strict';

angular.module('apiGatewayApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('endpoint', {
        url: '/endpoint',
        templateUrl: 'app/endpoint/endpoint.html',
        controller: 'EndpointCtrl'
      });
  });