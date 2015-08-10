'use strict';

angular.module('apiGatewayApp')
  .controller('ExplorerCtrl', function ($scope, $rootScope) {
    console.log('Init ExplorerCtrl');
    $scope.message = 'Hello';

    $rootScope.showExplorerView = true;

    $scope.$on('$destroy', function () {
      console.log('Destroy explorer');
      $rootScope.showExplorerView = false;
    });

  });
