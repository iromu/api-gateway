'use strict';

angular.module('app')
  .controller('AdminController', function ($scope, $http, Auth, User, FullRestangular, uiGridConstants) {

    var paginationOptions = {
      pageNumber: 1,
      pageSize: 25,
      sort: null
    };

    $scope.gridOptions = {
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
        $scope.gridApi = gridApi;
        $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {
          if (sortColumns.length === 0) {
            paginationOptions.sort = null;
          } else {
            console.log(JSON.stringify(sortColumns));
            paginationOptions.sort = sortColumns[0].sort.direction;
          }
          getPage();
        });
        gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
          paginationOptions.pageNumber = newPage;
          paginationOptions.pageSize = pageSize;
          getPage();
        });
      }
    };


    var getPage = function () {
      FullRestangular.all('users').getList({},{
        page: paginationOptions.pageNumber,
        size: paginationOptions.pageSize,
        order: paginationOptions.sort
      }).then(function (response) {
        $scope.gridOptions.totalItems=response.headers('total');
        $scope.users = response.data;
        $scope.gridOptions.data = response.data;
      });
    };

    getPage();



    // Use the User $resource to fetch all users
    //$scope.users = User.query();

    $scope.delete = function (user) {
      User.remove({id: user._id});
      angular.forEach($scope.users, function (u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
