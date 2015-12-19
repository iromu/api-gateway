(function () {

  'use strict';

  angular.module('app.learn', []);
  angular.module('app.learn')
    .controller('LearnController', LearnController);

  function LearnController($log, $scope) {

    var vm = this;
    vm.jumbotron = {url: '/assets/templates/jumbotron.html'};

    activate();


    function activate() {
      $log.log('Activate');
     
    }

  }
}());
