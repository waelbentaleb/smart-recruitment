app.controller('candidatesController', function ($scope, $rootScope, $http, ngDialog, Upload) {

  var url = window.location.origin

  $rootScope.candidates = null
  $rootScope.candidateObject = {}

  $scope.gridOptions = {
    enableFiltering: true,
    autoResize: true,
    onRegisterApi: function (gridApi) {
      this.gridApi = gridApi;
    },
    rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
    columnDefs: [
      { field: 'name', displayName: 'Name'},
      { field: 'cin', displayName: 'CIN', width: '8%' },
      { field: 'email', displayName: 'Email'},
      { field: 'phone', displayName: 'Phone', width: '8%' },
      { field: 'position', displayName: 'Position' },
      {
        field: 'cv', displayName: 'CV', width: '6%', cellTemplate: '<div style="margin-left:2px; margin-top:2px">\
          <button ng-disabled="!row.entity.cv" type="button" class="btn btn-primary btn-round btn-fab btn-fab-mini btn-info"\
          ng-click="grid.appScope.openInNewTab(row.entity.cv)">\
              <i class="material-icons">search</i>\
          </button>\
        </div> ' },
      { field: 'recruiter.name', displayName: 'Recruiter', width: '10%'},
      { field: 'status', displayName: 'Status', width: '8%' },
      {
        field: 'status', displayName: 'Actions', width: '8%', cellTemplate: '<div>\
              <button class="btn btn-primary btn-round btn-fab btn-fab-mini btn-info" ng-click="grid.appScope.editCandidate(row.entity._id)">\
                <i class="material-icons">mode_edit</i>\
              </button>\
              <button class="btn btn-primary btn-round btn-fab btn-fab-mini btn-danger" ng-click="grid.appScope.deleteCandidate(row.entity._id)">\
                <i class="material-icons">delete</i>\
              </button>\
          </div> '
      }
    ]
  }

  $http.get(url + '/candidates').then(function (response) {
    $rootScope.candidates = response.data.candidates
    $scope.gridOptions.data = $rootScope.candidates
  }).catch(function (err) {
    console.log(err);
  })

  function getElementIndex(_id) {
    for (var i = 0; i < $rootScope.candidates.length; i++) {
      if ($rootScope.candidates[i]._id == _id)
        return i
    }
    return -1
  }

  $scope.addCandidate = function () {

    $rootScope.candidateObject = {}

    ngDialog.open({
      template: 'components/candidate/candidate.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        $scope.modelTitle = "Add new candidate"

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $http.post(url + '/candidate', $rootScope.candidateObject).then(function (response) {

            $rootScope.candidates.push(response.data.candidate)

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

  $scope.editCandidate = function (_id) {

    $rootScope.candidateObject = {}

    ngDialog.open({
      template: 'components/candidate/candidate.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        var index = getElementIndex(_id)
        $scope.modelTitle = "Edit candidate"
        $rootScope.candidateObject = angular.copy($rootScope.candidates[index])

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $http.put(url + '/candidate/' + $rootScope.candidateObject._id, $rootScope.candidateObject).then(function (response) {
            $rootScope.candidates[index] = angular.copy($rootScope.candidateObject)
            $scope.loading = false
            $scope.closeThisDialog()
          }).catch(function (err) {
            console.log(err)
          })

        }
      }]
    })
  }

  $scope.deleteCandidate = function (_id) {
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

          $http.delete(url + '/candidate/' + $rootScope.candidates[index]._id).then(function (response) {
            $rootScope.candidates.splice(index, 1)
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

  $rootScope.upload = function (file) {
    $scope.inUpload = true

    Upload.upload({
      url: url + '/upload',
      arrayKey: '',
      data: { file: file }

    }).then(function (resp) {

      const fileUrl = resp.data.fileUrls[0]
      $rootScope.candidateObject.cv = fileUrl

      $scope.inUpload = false

    }, function (err) {
      console.log('Error status: ' + err.status);
    }, function (evt) {
      $scope.progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
      console.log($scope.progressPercentage)
    })
  }

  $rootScope.openInNewTab = function (url) {
    window.open(url, '_blank')
  }

})
