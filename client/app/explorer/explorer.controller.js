'use strict';

angular.module('apiGatewayApp')
  .controller('ExplorerCtrl', function ($scope, $rootScope, $stateParams) {
    console.log('Init ExplorerCtrl $stateParams: ' + JSON.stringify($stateParams));
    $scope.message = 'Hello';

    if (!$rootScope.showExplorerView) {
      $rootScope.showExplorerView = true;
    }

    if ('code' in $stateParams) {
      console.log('Emit selectService: ' + $stateParams.code);
      $scope.$emit('selectService', {code: $stateParams.code});
    }

    $scope.$on('$destroy', function () {
      console.log('Destroy explorer');
      $rootScope.showExplorerView = false;
    });

  });
