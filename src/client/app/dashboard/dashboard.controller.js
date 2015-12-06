(function () {

  'use strict';

  angular.module('app.dashboard', []);
  angular.module('app.dashboard')
    .controller('DashboardController', DashboardController);

  function DashboardController($log, $scope, FullRestangular) {

    $log.log('Init DashboardController');

    var vm = this;

    var paginationOptions = {
      pageNumber: 1,
      pageSize: 25,
      sort: null
    };

    vm.gridOptionsService = {
      paginationPageSizes: [25],
      paginationPageSize: 25,
      useExternalPagination: true,
      useExternalSorting: true,
      columnDefs: [
        {name: 'name'},
        {name: 'code'},
        {name: 'latestVersion'},
        {name: 'hits'}
      ],
      onRegisterApi: function (gridApi) {
        vm.gridApi = gridApi;
        vm.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          if (sortColumns.length === 0) {
            paginationOptions.sort = null;
          } else {
            $log.log(JSON.stringify(sortColumns));
            paginationOptions.sort = sortColumns[0].sort.direction;
          }
          getPage();
        });
        vm.gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          paginationOptions.pageNumber = newPage;
          paginationOptions.pageSize = pageSize;
          getPage();
        });
      }
    };


    var getPage = function () {
      FullRestangular.all('services').getList({}, {
        page: paginationOptions.pageNumber,
        size: paginationOptions.pageSize,
        order: paginationOptions.sort
      }).then(function (response) {
        vm.gridOptionsService.totalItems = response.headers('total');
        vm.gridOptionsService.data = response.data;
      });
    };

    getPage();

    activate();

    $scope.$on('$destroy', function () {
      $log.log('Destroy DashboardController');
    });

    function activate() {
      $log.log('Activate');
    }

  }


}());
