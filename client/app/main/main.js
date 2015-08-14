'use strict';

angular.module('apiGatewayApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('main.explorer', {
        url: 'explorer',
        templateUrl: 'app/explorer/explorer.html',
        controller: 'ExplorerCtrl'
      })
      .state('main.explorer_select', {
        url: 'explorer/:code',
        templateUrl: 'app/explorer/explorer.html',
        controller: 'ExplorerCtrl'
      });
  });
