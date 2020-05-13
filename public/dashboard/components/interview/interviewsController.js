app.controller('interviewsController', function ($scope, $rootScope, $http, ngDialog, $window) {

  var url = window.location.origin

  $rootScope.interviews = null
  $rootScope.interviewObject = {}

  $scope.gridOptions = {
    enableFiltering: true,
    autoResize: true,
    onRegisterApi: function (gridApi) {
      this.gridApi = gridApi;
    },
    rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
    columnDefs: [
      { field: 'date', width: '10%', cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.date | date:"yyyy-MM-dd" }}</div>' },
      { field: 'candidate.name', displayName: 'Candidate' },
      { field: 'qcm.title', displayName: 'QCM' },
      { field: 'status', width: '10%' },
      { field: 'recruiter.name', displayName: 'Recruiter', width: '15%' },
      {
        field: 'status', displayName: 'Actions', width: '8%', cellTemplate: `<div>\
              <button ng-disabled="row.entity.status=='pending'" class="btn btn-primary btn-round btn-fab btn-fab-mini btn-info" ng-click="grid.appScope.showResults(row.entity._id)">\
                <i class="material-icons">assessment</i>\
              </button>\
              <button class="btn btn-primary btn-round btn-fab btn-fab-mini btn-info" ng-click="grid.appScope.editInterview(row.entity._id)">\
                <i class="material-icons">mode_edit</i>\
              </button>\
              <button class="btn btn-primary btn-round btn-fab btn-fab-mini btn-danger" ng-click="grid.appScope.deleteInterview(row.entity._id)">\
                <i class="material-icons">delete</i>\
              </button>\
          </div> `
      }
    ]
  }

  $http.get(url + '/interviews').then(function (response) {
    $rootScope.interviews = response.data.interviews
    $scope.gridOptions.data = $rootScope.interviews
  }).catch(function (err) {
    console.log(err);
  })

  $http.get(url + '/qcms').then(function (response) {
    $rootScope.qcms = response.data.qcms
  }).catch(function (err) {
    console.log(err);
  })

  $http.get(url + '/candidates').then(function (response) {
    $rootScope.candidates = response.data.candidates
  }).catch(function (err) {
    console.log(err);
  })

  function getElementIndex(_id) {
    for (var i = 0; i < $rootScope.interviews.length; i++) {
      if ($rootScope.interviews[i]._id == _id)
        return i
    }
    return -1
  }

  $scope.addInterview = function () {

    ngDialog.open({
      template: 'components/interview/interview.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        $scope.modelTitle = "Add new interview"

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $http.post(url + '/interview', $scope.interviewObject).then(function (response) {

            response.data.interview
            $rootScope.interviews.push(response.data.interview)

            $scope.loading = false
            $scope.closeThisDialog()
          }).catch(function (err) {
            $scope.message = err.data.error
            console.log(err)
          })

        }
      }]
    })
  }

  $scope.editInterview = function (_id) {

    ngDialog.open({
      template: 'components/interview/interview.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        var index = getElementIndex(_id)
        $scope.modelTitle = "Edit interview"
        $rootScope.interviewObject = angular.copy($rootScope.interviews[index])
        $rootScope.interviewObject.date = new Date($rootScope.interviewObject.date)

        console.log($rootScope.interviewObject)

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $http.put(url + '/interview/' + $rootScope.interviewObject._id, $rootScope.interviewObject).then(function (response) {
            $rootScope.interviews[index] = angular.copy($rootScope.interviewObject)
            $scope.loading = false
            $scope.closeThisDialog()
          }).catch(function (err) {
            console.log(err)
          })
        }

      }]
    })
  }

  $scope.deleteInterview = function (_id) {
    ngDialog.open({
      template: 'assets/delete.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        var index = getElementIndex(_id)

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $http.delete(url + '/interview/' + $rootScope.interviews[index]._id).then(function (response) {
            $rootScope.interviews.splice(index, 1)
          }).catch(function (err) {
            console.log(err)
          }).finally(function () {
            $scope.loading = false
            $scope.closeThisDialog()
          })
        }
      }]
    })
  }

  $scope.showResults = function (_id) {

    ngDialog.open({
      template: 'components/interview/results.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', '$window', function ($scope, $rootScope, $window) {

        var index = getElementIndex(_id)

        setTimeout(() => {
          console.log($window.result)
          $window.result = $rootScope.interviews[index].result
        }, 1000);

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $http.post(url + '/interview', $scope.interviewObject).then(function (response) {

            response.data.interview
            $rootScope.interviews.push(response.data.interview)

            $scope.loading = false
            $scope.closeThisDialog()
          }).catch(function (err) {
            $scope.message = err.data.error
            console.log(err)
          })

        }
      }]
    })
  }

})
