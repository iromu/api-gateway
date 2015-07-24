'use strict';

angular.module('apiGatewayApp')
  .controller('MainCtrl', function ($scope, $http, socket, FullRestangular) {

    var sampleService = {};

    $scope.publicServices = [];
    $scope.service = {code: 'sampleservice', apiVersion: '', apiVersionSelection: ''};

    // init form
    $scope.swaggerUrl = 'http://localhost:9000/sampleservice/';

    FullRestangular.all('services').getList({code: 'sampleservice'}).then(function (response) {
      sampleService = response.data[0];
      $scope.service = sampleService;
      $scope.service.apiVersionSelection = sampleService.latestVersion;
    });

    FullRestangular.all('services').getList({public: true}).then(function (response) {
      $scope.publicServices = response.data;
    });

    // error management
    $scope.swaggerErrorHandler = function (data, status) {
      alert('failed to load swagger: ' + status);
    };

    // transform API explorer requests
    $scope.swaggerTransform = function (request) {
      request.headers['X-Api-Version'] = $scope.service.apiVersionSelection;
    };

    // API explorer
    $scope.explore = function () {
      $scope.swaggerUrl = 'http://localhost:9000/' + $scope.service.code;
    };

  });
