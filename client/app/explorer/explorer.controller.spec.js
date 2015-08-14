'use strict';

describe('Controller: ExplorerCtrl', function () {

  // load the controller's module
  beforeEach(module('apiGatewayApp'));

  var ExplorerCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ExplorerCtrl = $controller('ExplorerCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(scope.message).toEqual('Hello');
  });
});
