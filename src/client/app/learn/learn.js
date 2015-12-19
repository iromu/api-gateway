(function () {

  'use strict';

  angular.module('app.learn')
    .config(function ($stateProvider) {
      $stateProvider
        .state('learn', {
          url: '/learn',
          templateUrl: 'app/learn/learn.html',
          controller: 'LearnController',
          controllerAs: 'vm'
        })
    });
}());
