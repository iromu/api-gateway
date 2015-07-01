;(function(){
'use strict';

  angular
    .module('apiGatewayApp')
    .controller( 'AdminCtrl', AdminCtrl );

  AdminCtrl.$inject = ['$scope', 'Auth', 'User', 'resolvedUsers', '$location'];
  function AdminCtrl($scope, Auth, User, resolvedUsers, $location) {
    var vm = this;
    vm.details = false;
    vm.currentUser = null;
    vm.users = resolvedUsers;
    vm.remove = remove;
    vm.showUser = showUser;
    vm.hideUser = hideUser;

    //////////////

    function showUser(user){
      if(vm.currentUser && vm.currentUser._id === user._id) {
        return hideUser();
      }
      vm.currentUser = user;
      vm.details = true;
    }
    function hideUser(){
      vm.currentUser = null;
      vm.details = false;
    }

    function remove(user) {
      User.remove({ id: user._id });
      angular.forEach(vm.users, function(u, i) {
        if (u === user) {
          vm.users.splice(i, 1);
        }
      });
    }
  }

}).call(this);