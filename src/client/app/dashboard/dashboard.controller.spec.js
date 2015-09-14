'use strict';

describe('Controller: DashboardController', function () {

  // load the controller's module
  beforeEach(module('app.dashboard'));

  var EndpointCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EndpointCtrl = $controller('DashboardController', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
