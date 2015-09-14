(function () {

  'use strict';

  angular.module('app.dashboard', []);
  angular.module('app.dashboard')
    .controller('DashboardController', function ($scope) {
      $scope.message = 'Hello';
    });

}());
