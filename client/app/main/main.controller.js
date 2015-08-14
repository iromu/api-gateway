'use strict';

angular.module('apiGatewayApp')
  .controller('MainCtrl', function ($scope, $http, $state, $rootScope, socket, FullRestangular) {
    console.log('Init MainCtrl');
    $scope.topServices = [];
    $rootScope.showExplorerView = false;

    $scope.publicServices = [];

    $scope.codeSelection = undefined;
    $scope.apiVersionSelection = undefined;

    $scope.service = {code: undefined, apiVersion: undefined, endpoints: []};

    FullRestangular.all('services').getList({public: true}).then(function (response) {
      console.log('MainCtrl publicServices loaded');
      $scope.publicServices = response.data;

      $scope.topServices = response.data;
      socket.syncUpdates('service', $scope.topServices);
    });

    // error management
    $scope.swaggerErrorHandler = function (data, status) {
      console.log('failed to load swagger: ' + status);
    };

    // transform API explorer requests
    $scope.swaggerTransform = function (request) {
      request.headers['X-Api-Version'] = $scope.apiVersionSelection;
    };

    // API explorer
    $scope.exploreSwagger = function () {
      var ts = Date.now();
      $scope.swaggerUrl = '/' + $scope.service.code + '/swagger.json' + '?X-Api-Version=' + $scope.apiVersionSelection + '&ts=' + ts;
      $scope.swaggerUrlMin = '/' + $scope.service.code + '/swagger.json' + '?X-Api-Version=' + $scope.apiVersionSelection;
      $scope.swaggerUrlDisplay = '/' + $scope.service.code + '/swagger.json';

      // $state.transitionTo('main.explorer');
    };

    $scope.loadVersions = function () {
      //$scope.apiVersionSelection = undefined;
      //$scope.service = _.filter($scope.publicServices, {'code': $scope.codeSelection});
      //$scope.endpoints = $scope.service;
    };

    $scope.selectService = function (value) {

      console.log('MainCtrl selectService: ' + JSON.stringify(value.code));
      if (!$rootScope.showExplorerView) {
        console.log('MainCtrl showExplorerView on selectService');
        $scope.showExplorer();
      }
      //TODO The next block should be called inside a callback
      // or something passed to the previous call
      //something == custom json object with params?, listener?
      $scope.apiVersionSelection = '@LATEST';
      $scope.codeSelection = value.code;
      $scope.service = _.filter($scope.publicServices, {'code': $scope.codeSelection})[0];
      if ($scope.service) {
        $scope.exploreSwagger();
      } else {
        FullRestangular.all('services').getList({code: $scope.codeSelection}).then(function (response) {
          console.log('MainCtrl services by code');
          $scope.service = response.data[0];
          $scope.exploreSwagger();
        });
      }

    };

    $scope.$on('$init', function () {
      console.log('Init main');
    });
    $scope.$on('$enter', function () {
      console.log('Enter main');
    });

    $scope.$on('$destroy', function () {
      console.log('Destroy main');
    });

    $scope.$on('selectService', function (event, data) {
      console.log('$scope On selectService: ' + data.code);
     // $scope.selectService(data);
    });

    $scope.showExplorer = function () {
      $rootScope.showExplorerView = true;
      if (!$scope.codeSelection) {
        console.log('Transition to explorer');
        $state.transitionTo('main.explorer');
      }
      else {
        console.log('Transition to explorer with code: ' + $scope.codeSelection);
        $state.transitionTo('main.explorer_select', {code: $scope.codeSelection});
      }
    };

  });
