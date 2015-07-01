'use strict';

angular.module('apiGatewayApp')
  .controller('MainCtrl', function ($scope, $http, socket, FullRestangular) {
    var sampleService = {};
    $scope.publicServices = [];
    $scope.service = {code: 'sampleservice'};

    FullRestangular.all('services').getList({code: 'sampleservice'}).then(function (response) {
      sampleService = response.data[0];
      $scope.service = sampleService;
    });

    FullRestangular.all('services').getList({public: true}).then(function (response) {
      $scope.publicServices = response.data;
    });

  });
