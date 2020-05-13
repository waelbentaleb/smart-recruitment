app.controller('qcmsController', function ($scope, $rootScope, $http, ngDialog, Upload) {

  var url = window.location.origin

  $rootScope.qcms = null
  $rootScope.qcmObject = {}

  $scope.gridOptions = {
    enableFiltering: true,
    autoResize: true,
    onRegisterApi: function (gridApi) {
      this.gridApi = gridApi;
    },
    rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
    columnDefs: [
      { field: 'title' },
      {
        field: 'questions', displayName: 'Nomber of question', width: '20%',  cellTemplate: `<div style="text-align: center">
              {{COL_FIELD.length}}
          </div>`
      },
      {
        field: 'status', displayName: 'Actions', width: '8%', cellTemplate: '<div>\
              <button class="btn btn-primary btn-round btn-fab btn-fab-mini btn-info" ng-click="grid.appScope.editQCM(row.entity._id)">\
                <i class="material-icons">mode_edit</i>\
              </button>\
              <button class="btn btn-primary btn-round btn-fab btn-fab-mini btn-danger" ng-click="grid.appScope.deleteQCM(row.entity._id)">\
                <i class="material-icons">delete</i>\
              </button>\
          </div> '
      }
    ]
  }

  $http.get(url + '/qcms').then(function (response) {
    $rootScope.qcms = response.data.qcms
    $scope.gridOptions.data = $rootScope.qcms
  }).catch(function (err) {
    console.log(err);
  })

  $http.get(url + '/questions').then(function (response) {
    $rootScope.questions = response.data.questions
  }).catch(function (err) {
    console.log(err);
  })

  function getElementIndex(_id) {
    for (var i = 0; i < $rootScope.qcms.length; i++) {
      if ($rootScope.qcms[i]._id == _id)
        return i
    }
    return -1
  }

  $scope.addQCM = function () {

    $rootScope.qcmObject = {
      questions: []
    }

    ngDialog.open({
      template: 'components/qcm/qcm.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        $scope.modelTitle = "Add new QCM"
        $rootScope.questionsInAdd = angular.copy($rootScope.questions)

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $rootScope.qcmObject.questions = $rootScope.qcmObject.questions.map(item => item._id)

          $http.post(url + '/qcm', $rootScope.qcmObject).then(function (response) {

            $rootScope.qcms.push(response.data.qcm)

            $scope.loading = false
            $scope.closeThisDialog()
          }).catch(function (err) {
            $scope.message = err.data.error
            console.log(err)
          })

        }

        $scope.addQuestion = function () {
          $rootScope.qcmObject.questions.push($scope.selectedQuestion)
          updateList()
          $scope.selectedQuestion = null
        }

        $scope.deleteQuestion = function (index) {
          $rootScope.qcmObject.questions.splice(index, 1)
          updateList()
        }

        function updateList() {
          $rootScope.questionsInAdd = angular.copy($rootScope.questions)

          for (var i = 0; i < $rootScope.questionsInAdd.length; i++) {
            for (var j = 0; j < $rootScope.qcmObject.questions.length; j++) {
              if ($rootScope.qcmObject.questions[j]._id == $rootScope.questionsInAdd[i]._id) {
                $rootScope.questionsInAdd.splice(i, 1)
                i--
                break
              }
            }
          }
        }

      }]
    })
  }

  $scope.editQCM = function (_id) {

    $rootScope.qcmObject = {}

    ngDialog.open({
      template: 'components/qcm/qcm.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        var index = getElementIndex(_id)
        $scope.modelTitle = "Edit QCM"
        $rootScope.qcmObject = angular.copy($rootScope.qcms[index])
        updateList()

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $rootScope.qcmObject.questions = $rootScope.qcmObject.questions.map(item => item._id)

          $http.put(url + '/qcm/' + $rootScope.qcmObject._id, $rootScope.qcmObject).then(function (response) {
            $rootScope.qcms[index] = angular.copy($rootScope.qcmObject)
            $scope.loading = false
            $scope.closeThisDialog()
          }).catch(function (err) {
            console.log(err)
          })
        }

        $scope.addQuestion = function () {
          $rootScope.qcmObject.questions.push($scope.selectedQuestion)
          updateList()
          $scope.selectedQuestion = null
        }

        $scope.deleteQuestion = function (index) {
          $rootScope.qcmObject.questions.splice(index, 1)
          updateList()
        }

        function updateList() {
          $rootScope.questionsInAdd = angular.copy($rootScope.questions)

          for (var i = 0; i < $rootScope.questionsInAdd.length; i++) {
            for (var j = 0; j < $rootScope.qcmObject.questions.length; j++) {
              if ($rootScope.qcmObject.questions[j]._id == $rootScope.questionsInAdd[i]._id) {
                $rootScope.questionsInAdd.splice(i, 1)
                i--
                break
              }
            }
          }
        }

      }]
    })
  }

  $scope.deleteQCM = function (_id) {
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

          $http.delete(url + '/qcm/' + $rootScope.qcms[index]._id).then(function (response) {
            $rootScope.qcms.splice(index, 1)
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

})
