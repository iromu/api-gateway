(function () {

  'use strict';

angular.module('app.main')
  .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'vm'
      })
      .state('main.explorer', {
        url: 'explorer',
        templateUrl: 'app/explorer/explorer.html',
        controller: 'ExplorerController',
        controllerAs: 'vm'
      })
      .state('main.explorer_select', {
        url: 'explorer/:code',
        templateUrl: 'app/explorer/explorer.html',
        controller: 'ExplorerController',
        controllerAs: 'vm'
      });
  });
}());
