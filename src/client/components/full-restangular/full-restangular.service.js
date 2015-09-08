(function () {
  'use strict';

  angular.module('app.components')
    .factory('FullRestangular', function (Restangular) {
      return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setFullResponse(true);
      });
    });
}());
