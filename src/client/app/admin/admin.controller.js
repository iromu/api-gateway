(function () {

  'use strict';

  angular.module('app.admin', []);

  angular.module('app.admin')
    .controller('AdminController', function ($log, $scope, $http, Auth, User, FullRestangular, uiGridConstants) {

      var vm = this;

      var paginationOptions = {
        pageNumber: 1,
        pageSize: 25,
        sort: null
      };

      vm.gridOptions = {
        enableRowSelection: true,
        multiSelect: false,
        paginationPageSizes: [25],
        paginationPageSize: 25,
        useExternalPagination: true,
        useExternalSorting: true,
        columnDefs: [
          {name: 'name'},
          {name: 'email'},
          {name: 'role'}
        ],
        onRegisterApi: function (gridApi) {
          gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
            if (sortColumns.length === 0) {
              paginationOptions.sort = null;
            } else {
              $log.log(sortColumns);
              paginationOptions.sort = sortColumns[0].sort.direction;
            }
            getPage();
          });
          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            paginationOptions.pageNumber = newPage;
            paginationOptions.pageSize = pageSize;

            $scope.$emit('paginationChanged', newPage, pageSize);
            getPage();
          });
          gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            $scope.$emit('rowSelectionChanged', row);
          });

          gridApi.selection.on.rowSelectionChangedBatch($scope, function (rows) {
            var msg = 'rows changed ' + rows.length;
            $scope.$emit('rowSelectionChangedBatch', rows);
            $log.log(msg);
          });
        }
      };

      $scope.$on('rowSelectionChanged', function (event, row) {
        $log.log(row);
      });

      vm.addRow = function () {

      };

      var getPage = function () {
        FullRestangular.all('users').getList({}, {
          page: paginationOptions.pageNumber,
          size: paginationOptions.pageSize,
          order: paginationOptions.sort
        }).then(function (response) {
          vm.gridOptions.totalItems = response.headers('total');
          vm.users = response.data;
          vm.gridOptions.data = response.data;
        });
      };

      getPage();


      // Use the User $resource to fetch all users
      //vm.users = User.query();

      vm.delete = function (user) {
        User.remove({id: user._id});
        angular.forEach(vm.users, function (u, i) {
          if (u === user) {
            vm.users.splice(i, 1);
          }
        });
      };

      $scope.$on('$destroy', function () {
        $log.log('Destroy AdminController');
      });

    });
}());
