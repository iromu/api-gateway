(function () {
  'use strict';


  angular.module('app.explorer', []);
  angular.module('app.explorer')
    .controller('ExplorerController', ExplorerController);

  function ExplorerController($log, $scope, $stateParams, $location, apiService) {

    $log.log('Init ExplorerController with $stateParams: ' + JSON.stringify($stateParams));

    var vm = this;
    vm.loadingServices = false;
    vm.apiVersionSelection = '@latest';

    var port = ($location.port() !== 80 && $location.protocol() !== 'https') ? ':' + $location.port() : '';
    vm.apiRestBaseEndpoint = $location.protocol() + '://' + $location.host() + port + '/';

    // error management
    vm.swaggerErrorHandler = function (data, status) {
      $log.log('failed to load swagger: ' + status);
    };

    // transform API explorer requests
    vm.swaggerTransform = function (request) {
      request.headers['X-Api-Version'] = vm.apiVersionSelection;
    };


    vm.loadVersions = function () {
      $log.log('loadVersions');
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
      $log.log('Destroy ExplorerController');
      $scope.$emit('showExplorer', false);
    });

    function activate() {
      $log.log('Activate');
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
