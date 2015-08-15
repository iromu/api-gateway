'use strict';

describe('Controller: ExplorerCtrl', function () {

  // load the controller's module
  beforeEach(module('apiGatewayApp'));

  var vm, scope, stateParams;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $stateParams) {
    scope = $rootScope.$new();
    spyOn(scope, '$emit');
    stateParams = $stateParams;
    stateParams.code = 'test';
    vm = $controller('ExplorerCtrl', {
      $scope: scope,
      $stateParams: stateParams
    });
  }));

  it('should emit selectService when code is selected', function () {
    expect(scope.$emit).toHaveBeenCalledWith('selectService', {code: 'test'});
  });

  it('should emit showExplorer {true} when no code is selected',
    inject(function ($controller, $rootScope) {
      scope = $rootScope.$new();
      spyOn(scope, '$emit');
      stateParams = {};
      vm = $controller('ExplorerCtrl', {
        $scope: scope,
        $stateParams: stateParams
      });

      expect(scope.$emit).toHaveBeenCalledWith('showExplorer', true);
    }));

  it('should set codeSelection scope to test', function () {
    expect(scope.codeSelection).toBe('test');
  });

  it('should set apiRestBaseEndpoint scope to http://server/', function () {
    expect(vm.apiRestBaseEndpoint).toBe('http://server/');
  });

  it('should emit showExplorer {false} when scope $destroyed', function () {
    scope.$destroy();
    expect(scope.$emit).toHaveBeenCalledWith('showExplorer', false);
  });
});
