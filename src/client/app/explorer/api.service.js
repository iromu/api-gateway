(function () {
  'use strict';

  angular.module('app.explorer')
    .factory('apiService', function (FullRestangular) {

      var service = FullRestangular.service('services');

      service.getVersioning = function (code) {
        return this.one(code).getList('versioning');
      };

      service.typeServiceCode = function (text) {
        return FullRestangular.all('services/typeahead').getList({code: text});
      };

      return service;
    });
}());
