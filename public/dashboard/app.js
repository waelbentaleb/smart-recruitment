var app = angular.module("adminApp", ['ngRoute', 'ngDialog', 'ngFileUpload', 'ui.grid']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      redirectTo: '/interviews'
    })
    .when('/candidates', {
      templateUrl: 'components/candidate/candidates.html',
      controller: 'candidatesController'
    })
    .when('/questions', {
      templateUrl: 'components/question/questions.html',
      controller: 'questionsController'
    })
    .when('/qcms', {
      templateUrl: 'components/qcm/qcms.html',
      controller: 'qcmsController'
    })
    .when('/interviews', {
      templateUrl: 'components/interview/interviews.html',
      controller: 'interviewsController'
    })
    .when('/profile', {
      templateUrl: 'components/profile/profile.html',
      controller: 'profileController'
    })

})


app.controller('adminController', function ($scope, $rootScope, $http, $window) {

  var url = window.location.origin

  $rootScope.logout = function () {
    $http.put(url + "/signOut").then(function (response) {
      if (response.status == 204) {
        $window.location.href = '/dashboard/login.html'
      } else {
        console.log(response)
      }
    }).catch(function (err) {
      console.log(err)
    })
  }

})
