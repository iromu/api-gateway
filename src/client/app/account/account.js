(function () {

  'use strict';

  angular.module('app.account', []);

  angular.module('app.account')
    .config(function ($stateProvider) {
      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'app/account/login/login.html',
          controller: 'LoginController'
        })
        .state('signup', {
          url: '/signup',
          templateUrl: 'app/account/signup/signup.html',
          controller: 'SignupController'
        })
        .state('settings', {
          url: '/settings',
          templateUrl: 'app/account/settings/settings.html',
          controller: 'SettingsController',
          authenticate: true
        });
    });
}());
