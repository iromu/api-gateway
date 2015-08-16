(function () {
  'use strict';

  angular.module('app.core', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'btford.socket-io',
    'ui.router',
    'ui.bootstrap',
    'restangular',
    'swaggerUi',
    'ui.grid',
    'ui.grid.pagination',
    'app.constants'
  ]);

}());
