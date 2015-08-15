(function () {
  'use strict';

  angular.module('apiGatewayApp')
    .controller('ExplorerCtrl', function ($scope, $stateParams, $location) {
      var vm = this;
      console.log('Init ExplorerCtrl $stateParams: ' + JSON.stringify($stateParams));

      var port = (($location.port() !== 80) ? ':' + $location.port() : '');
      vm.apiRestBaseEndpoint = $location.protocol() + '://' + $location.host() + port + '/';

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
}());
