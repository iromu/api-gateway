;(function(){
'use strict';
angular
  .module('apiGatewayApp', [
    
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'restangular',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap'

  ])
  .constant('serverBaseUrl', 'http://localhost:9000')
  .constant('serverUrl', 'http://localhost:9000/api/')
  .config( appConfig )
  .run( run );

  appConfig.$inject = [
    'RestangularProvider',
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$httpProvider'];
  function appConfig(RestangularProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    RestangularProvider.setBaseUrl('http://localhost:9000/api/');
    RestangularProvider.setRestangularFields({
      id: '_id',
      route: 'restangularRoute',
      selfLink: 'self.href'
    });

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  }
  
  run.$inject = ['$rootScope', '$location', 'Auth'];
  function run($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function(loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  }

}).call(this);