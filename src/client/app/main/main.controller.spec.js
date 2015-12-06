'use strict';

describe('Controller: MainController', function () {

  beforeEach(module('app.core'));
  beforeEach(module('app.components'));
  beforeEach(module('app.main'));
  beforeEach(module('socketMock'));

  var vm, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    vm = $controller('MainController', {
      $scope: scope
    });
  }));

  it('should set showExplorerView vm to false', function () {
    expect(vm.showExplorerView).toBe(false);
  });


});
