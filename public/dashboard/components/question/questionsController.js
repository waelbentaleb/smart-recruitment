app.controller('questionsController', function ($scope, $rootScope, $http, ngDialog, Upload) {

  var url = window.location.origin

  $rootScope.questions = null
  $rootScope.questionObject = {}

  $scope.gridOptions = {
    enableFiltering: true,
    autoResize: true,
    onRegisterApi: function (gridApi) {
      this.gridApi = gridApi;
    },
    rowTemplate: '<div ng-repeat="col in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ui-grid-cell></div>',
    columnDefs: [
      { field: 'text', displayName: 'Question' },
      {
        field: 'responses', displayName: 'Nomber of responses', width: '20%',  cellTemplate: `<div style="text-align: center">
              {{COL_FIELD.length}}
          </div>`
      },      {
        field: 'status', displayName: 'Actions', width: '8%', cellTemplate: '<div>\
              <button class="btn btn-primary btn-round btn-fab btn-fab-mini btn-info" ng-click="grid.appScope.editQuestion(row.entity._id)">\
                <i class="material-icons">mode_edit</i>\
              </button>\
              <button class="btn btn-primary btn-round btn-fab btn-fab-mini btn-danger" ng-click="grid.appScope.deleteQuestion(row.entity._id)">\
                <i class="material-icons">delete</i>\
              </button>\
          </div> '
      }
    ]
  }

  $http.get(url + '/questions').then(function (response) {
    $rootScope.questions = response.data.questions
    $scope.gridOptions.data = $rootScope.questions
  }).catch(function (err) {
    console.log(err);
  })

  function getElementIndex(_id) {
    for (var i = 0; i < $rootScope.questions.length; i++) {
      if ($rootScope.questions[i]._id == _id)
        return i
    }
    return -1
  }

  $scope.addQuestion = function () {

    $rootScope.questionObject = {
      responses: []
    }

    ngDialog.open({
      template: 'components/question/question.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        $scope.modelTitle = "Add new question"
        $scope.response = {
          text: null,
          points: null
        }

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $http.post(url + '/question', $rootScope.questionObject).then(function (response) {

            $rootScope.questions.push(response.data.question)

            $scope.loading = false
            $scope.closeThisDialog()
          }).catch(function (err) {
            $scope.message = err.data.error
            console.log(err)
          })

        }

        $scope.addResponse = function (response) {
          $rootScope.questionObject.responses.push($scope.response)
          $scope.response = {
            text: null,
            points: null
          }
        }

        $scope.deleteResponse = function (index) {
          $rootScope.questionObject.responses.splice(index, 1)
        }

      }]
    })
  }

  $scope.editQuestion = function (_id) {

    $rootScope.questionObject = {}

    ngDialog.open({
      template: 'components/question/question.html',
      className: 'ngdialog-theme-default',
      width: '700px',
      controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

        var index = getElementIndex(_id)
        $scope.modelTitle = "Edit question"
        $rootScope.questionObject = angular.copy($rootScope.questions[index])

        $scope.exit = function () {
          $scope.closeThisDialog()
        }

        $scope.ok = function () {
          loading = true

          $http.put(url + '/question/' + $rootScope.questionObject._id, $rootScope.questionObject).then(function (response) {
            $rootScope.questions[index] = angular.copy($rootScope.questionObject)
            $scope.loading = false
            $scope.closeThisDialog()
          }).catch(function (err) {
            console.log(err)
          })
        }

        $scope.addResponse = function (response) {
          $rootScope.questionObject.responses.push($scope.response)
          $scope.response = {
            text: null,
            points: null
          }
        }

        $scope.deleteResponse = function (index) {
          $rootScope.questionObject.responses.splice(index, 1)
        }

      }]
    })
  }

  $scope.deleteQuestion = function (_id) {
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

          $http.delete(url + '/question/' + $rootScope.questions[index]._id).then(function (response) {
            $rootScope.questions.splice(index, 1)
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
