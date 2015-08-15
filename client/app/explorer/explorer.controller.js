'use strict';

angular.module('apiGatewayApp')
  .controller('ExplorerCtrl', function ($scope, $rootScope, $stateParams, $location, ENV) {
    console.log('Init ExplorerCtrl $stateParams: ' + JSON.stringify($stateParams));

    $scope.apiRestBaseEndpoint = $location.protocol() + '://' + $location.host() + '/';

    if ('code' in $stateParams) {
      console.log('Emit selectService: ' + $stateParams.code);
      $scope.codeSelection = $stateParams.code;
      $scope.$emit('selectService', {code: $stateParams.code});
    }
    else {
      $scope.$emit('showExplorer', true);
    }

    $scope.$on('$destroy', function () {
      console.log('Destroy explorer');
      $scope.$emit('showExplorer', false);
    });

  });
