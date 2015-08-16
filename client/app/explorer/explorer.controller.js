(function () {
  'use strict';

  angular.module('app')
    .controller('ExplorerController', ExplorerController);

  function ExplorerController($scope, $stateParams, $location) {
    var vm = this;
    vm.apiVersionSelection = '@latest';

    console.log('Init ' + JSON.stringify($stateParams));

    var port = (($location.port() !== 80) ? ':' + $location.port() : '');
    vm.apiRestBaseEndpoint = $location.protocol() + '://' + $location.host() + port + '/';

    activate();

    // error management
    vm.swaggerErrorHandler = function (data, status) {
      console.log('failed to load swagger: ' + status);
    };

    // transform API explorer requests
    vm.swaggerTransform = function (request) {
      request.headers['X-Api-Version'] = vm.apiVersionSelection;
    };

    function exploreSwagger() {
      var ts = Date.now();
      vm.swaggerUrl = '/' + vm.codeSelection + '/swagger.json' + '?X-Api-Version=' + vm.apiVersionSelection + '&ts=' + ts;
      vm.swaggerUrlMin = '/' + vm.codeSelection + '/swagger.json' + '?X-Api-Version=' + vm.apiVersionSelection;
      vm.swaggerUrlDisplay = 'http://' + $location.host() + '/' + vm.codeSelection + '/swagger.json';
    };

    $scope.$on('$destroy', function () {
      console.log('Destroy explorer');
      $scope.$emit('showExplorer', false);
    });

    function activate() {
      console.log('Activate');

      $scope.$emit('showExplorer', true);
      if ('code' in $stateParams) {
        vm.codeSelection = $stateParams.code;
        exploreSwagger();
      }
    }
  }
}());
