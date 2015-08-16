'use strict';

angular.module('app')
  .config(function ($stateProvider) {
    $stateProvider
      .state('endpoint', {
        url: '/endpoint',
        templateUrl: 'app/endpoint/endpoint.html',
        controller: 'EndpointController'
      });
  });
