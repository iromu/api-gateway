(function () {

  'use strict';

  angular.module('app', [
      'app.core',
      'app.components',
      'app.explorer',
      'app.dashboard',
      'app.admin',
      'app.account',
      'app.learn',
      'app.main'
    ])
    .config(configure)
    .factory('authInterceptor', authInterceptor)
    .run(initialize);

  function configure($urlRouterProvider, $locationProvider, $httpProvider, RestangularProvider) {
    console.log('configure');
    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    var baseUrl = '/api';
    RestangularProvider.setBaseUrl(baseUrl);
  }

  function authInterceptor($q, $cookieStore, $location) {
    console.log('authInterceptor');
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }
        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function (response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  }

  function initialize($rootScope, $location, Auth) {
    console.log('initialize');
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
      Auth.isLoggedInAsync(function (loggedIn) {
        if (next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  }

}());
