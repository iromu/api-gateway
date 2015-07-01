;(function(){
'use strict';
  angular
    .module('apiGatewayApp')
    .config( main );

  main.$inject = ['$stateProvider'];

  /////////////////////

  function main($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'app/states/main/main.html',
        controller: 'MainCtrl as vm'
      });
  }
}).call(this);