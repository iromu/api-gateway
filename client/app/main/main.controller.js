'use strict';

angular.module('apiGatewayApp')
  .controller('MainCtrl', function ($scope, $http, socket, FullRestangular) {

    $scope.awesomeThings = [];

    $http.get('/api/services').success(function (awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('service', $scope.awesomeThings);
    });

    $scope.publicServices = [];

    $scope.codeSelection = undefined;
    $scope.apiVersionSelection = undefined;

    $scope.service = {code: undefined, apiVersion: undefined, endpoints: []};

    /*
     FullRestangular.all('services').getList({code: 'sampleservice'}).then(function (response) {
     $scope.service = response.data[0];
     $scope.swaggerUrl = '/' + $scope.service.code;
     });
     */

    FullRestangular.all('services').getList({public: true}).then(function (response) {
      $scope.publicServices = response.data;
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
      $scope.swaggerUrl = '/' + $scope.service.code + '/swagger.json' + '?X-Api-Version=' + $scope.apiVersionSelection;
    };

    $scope.loadVersions = function () {
      $scope.apiVersionSelection = undefined;
      //$scope.service = _.filter($scope.publicServices, {'code': $scope.codeSelection});
      //$scope.endpoints = $scope.service;
    };

    $scope.selectService = function (value) {
      $scope.apiVersionSelection = '@LATEST';
      $scope.codeSelection = value.code;
      $scope.service = _.filter($scope.publicServices, {'code': $scope.codeSelection})[0];
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

  });
