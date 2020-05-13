var app = angular.module("loginApp", ['ngRoute', 'ngDialog']);
var url = window.location.origin

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/login'
    })
    .when('/login', {
      templateUrl: 'components/login/login.html',
      controller: 'loginController'
    })
    .when('/start/:cin', {
      templateUrl: 'components/qcm/qcm.html',
      controller: 'qcmController'
    })
})

app.controller('loginController', function ($scope, $rootScope, $http, $window) {

  $scope.login = function () {
    $http.post(url + "/interview/start", { cin: $scope.cin }).then(function (response) {
      if (response.status == 200) {
        $window.location.href = '#/start/' + $scope.cin
      } else {
        console.log(response)
      }
    }).catch(function (err) {
      $scope.loginError = true
      console.log(err)
    })
  }
})

app.controller('qcmController', function ($scope, $rootScope, $http, $interval, $routeParams, $window, ngDialog) {

  $scope.questionIndex = 0
  $scope.timer = 60

  $scope.radioSelected = null
  var finished = false

  $http.post(url + "/interview/start", { cin: $routeParams.cin }).then(function (response) {
    if (response.status == 200) {
      $rootScope.qcm = response.data.qcm

      $scope.question = $rootScope.qcm.questions[$scope.questionIndex]

    } else {
      console.log(response)
    }
  }).catch(function (err) {
    console.log(err)
  })

  $interval(function () {
    if (!finished)
      if ($scope.timer > 0)
        $scope.timer--
      else
        $scope.nextQuestion()
  }, 1000)

  var result = []

  $scope.nextQuestion = function () {

    if (result.length != $rootScope.qcm.questions.length) {
      result.push({
        index: $scope.questionIndex,
        response: $scope.radioSelected,
        time: (new Date() - $window.startTime)
      })
    }

    if ($scope.questionIndex < $rootScope.qcm.questions.length - 1) {
      $scope.questionIndex++
      $scope.question = $rootScope.qcm.questions[$scope.questionIndex]
      $scope.timer = 60
    } else {
      finished = true

      $http.post(url + "/interview/result", { cin: $routeParams.cin, qcmResult: result, expressionResult: $window.faceResults }).then(function (response) {
        if (response.status == 200) {
          console.log(response.data.qcm)

          ngDialog.open({
            template: 'components/popup/popup.html',
            className: 'ngdialog-theme-default',
            width: '400px',
            controller: ['$scope', '$rootScope', function ($scope, $rootScope) {

              $scope.home = function () {
                window.location = '/'
              }
              
            }]
          })
        } else {
          console.log(response)
        }
      }).catch(function (err) {
        console.log(err)
      })

    }
  }

  $scope.updateResponses = function (index) {
    $scope.radioSelected = index
  }

})
