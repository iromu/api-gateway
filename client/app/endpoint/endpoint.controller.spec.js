'use strict';

describe('Controller: EndpointCtrl', function () {

  // load the controller's module
  beforeEach(module('app'));

  var EndpointCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EndpointCtrl = $controller('EndpointCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
