(function () {

  'use strict';

  angular.module('app.main', []);
  angular.module('app.main')
    .controller('MainController', MainController);

  function MainController($scope, $state, socket, FullRestangular) {

    var vm = this;
    vm.jumbotron = {url: '/assets/templates/jumbotron.html'};
    vm.topServices = [];
    vm.showExplorerView = false;

    activate();

    vm.showExplorer = function () {
      vm.showExplorerView = true;
    };

    vm.selectService = function (code) {
      $state.transitionTo('main.explorer_select', {code: code});
    };

    $scope.$on('showExplorer', function (event, data) {
      vm.showExplorerView = data;
    });

    function activate() {
      console.log('Activate');
      FullRestangular.all('services').getList({public: true}).then(function (response) {
        vm.topServices = response.data;
        socket.syncUpdates('service', vm.topServices);
      });
    }

  }
}());
