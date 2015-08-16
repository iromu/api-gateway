'use strict';

describe('Controller: MainCtrl', function () {


  beforeEach(module('apiGatewayApp'));
  beforeEach(module('socketMock'));

  var vm, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    vm = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should set showExplorerView vm to false', function () {
    expect(vm.showExplorerView).toBe(false);
  });


});
