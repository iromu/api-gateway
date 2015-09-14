(function () {

  'use strict';

  angular.module('app.admin')
    .config(function ($stateProvider) {
      $stateProvider
        .state('admin', {
          url: '/admin',
          templateUrl: 'app/admin/admin.html',
          controller: 'AdminController'
        });
    });
}());
