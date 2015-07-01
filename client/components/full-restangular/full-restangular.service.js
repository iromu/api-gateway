'use strict';

angular.module('apiGatewayApp')
  .factory('FullRestangular', ['Restangular', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setFullResponse(true);
    });
  }]);
