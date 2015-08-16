'use strict';

angular.module('app')
  .factory('FullRestangular', ['Restangular', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
      RestangularConfigurer.setFullResponse(true);
    });
  }]);
