app.controller('profileController', function ($scope, $rootScope, $http, ngDialog, $window) {
	var url = window.location.origin + "/user/changePassword"

	$scope.change = function () {

		if (!$scope.currentPassword) {
			$scope.message = "Old password is required !"
			$scope.wrongPassword = true

		} else if (!$scope.newPassword) {
			$scope.message = "New password is required !"
			$scope.wrongPassword = true

		} else if ($scope.newPassword.length < 8) {
			$scope.message = "New password must be longer than 8 characters !"
			$scope.wrongPassword = true

		} else if ($scope.newPassword != $scope.confirmPassword) {
			$scope.message = "Verify that you enter the same password !"
			$scope.wrongPassword = true

		} else {

			$http.put(url, { newPassword: $scope.confirmPassword, currentPassword: $scope.currentPassword }).then(function (response) {
				$rootScope.logout()

			}).catch(function (err) {
				console.log(err)
				if (err.status == 400) {
					$scope.message = err.data.error
					$scope.wrongPassword = true
				}
			})
		}

	}
})