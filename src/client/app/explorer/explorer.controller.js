(function () {
  'use strict';

  angular.module('app')
    .controller('ExplorerController', ExplorerController);

  function ExplorerController($scope, $stateParams, $location, apiService) {

    console.log('Init ' + JSON.stringify($stateParams));

    var vm = this;
    vm.loadingServices = false;
    vm.apiVersionSelection = '@latest';

    var port = ($location.port() !== 80 && $location.protocol() !== 'https') ? ':' + $location.port() : '';
    vm.apiRestBaseEndpoint = $location.protocol() + '://' + $location.host() + port + '/';

    // error management
    vm.swaggerErrorHandler = function (data, status) {
      console.log('failed to load swagger: ' + status);
    };

    // transform API explorer requests
    vm.swaggerTransform = function (request) {
      request.headers['X-Api-Version'] = vm.apiVersionSelection;
    };


    vm.loadVersions = function () {
      console.log('loadVersions');
      apiService.getVersioning(vm.codeSelection).then(function (response) {
        vm.versions = response.data;
      });
    };

    vm.selectVersion = function (version) {
      vm.apiVersionSelection = version;
      exploreSwagger();
    };


    vm.typeServiceCode = function (text) {
      delete vm.versions;
      return apiService.typeServiceCode(text).then(function (response) {
        return response.data;
      });
    };

    vm.onCodeSelection = function ($label) {
      vm.codeSelection = $label;
    };

    activate();

    $scope.$on('$destroy', function () {
      console.log('Destroy explorer');
      $scope.$emit('showExplorer', false);
    });

    function activate() {
      console.log('Activate');
      delete vm.versions;
      delete vm.codeSelection;
      $scope.$emit('showExplorer', true);
      if ('code' in $stateParams) {
        vm.codeSelection = $stateParams.code;
        vm.loadVersions();
        exploreSwagger();
      }
    }

    function exploreSwagger() {
      var ts = Date.now();
      vm.swaggerUrlDisplay = vm.apiRestBaseEndpoint + vm.codeSelection + '/swagger.json';
      vm.swaggerUrl = vm.swaggerUrlDisplay + '?X-Api-Version=' + vm.apiVersionSelection + '&ts=' + ts;
      vm.swaggerUrlMin = '/' + vm.codeSelection + '/swagger.json' + '?X-Api-Version=' + vm.apiVersionSelection;
    }
  }
}());
