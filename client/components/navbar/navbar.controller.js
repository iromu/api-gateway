(function () {
  'use strict';

  angular.module('app.components')
  .controller('NavbarController', function ($scope, $location, Auth, CONFIG) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }, {
      'title': 'Explorer',
      'link': '/explorer'
    }];
    $scope.brand = {
      title: (CONFIG && CONFIG.BRAND.TITLE) || 'Api Gateway'
    };
    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function () {
      Auth.logout();
      $location.path('/login');
    };

    $scope.isActive = function (route) {
      return route === $location.path();
    };
    });
}());
