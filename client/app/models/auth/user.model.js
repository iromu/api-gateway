;(function(){
'use strict';
  angular
    .module('apiGatewayApp')
    .factory('UserModel', UserModel);

  UserModel.$inject = ['Restangular'];
  function UserModel(Restangular){
    return Restangular.service('users');
  }

}).call(this);