angular.module('crud.controllers', [
		'ionic',
		'crud.services'
	])

.controller('AppCtrl', function($scope, User, $ionicPopup, $state, $ionicHistory) {
	$ionicHistory.clearHistory();

	$scope.isRegister = false;

	// attempt to signin via User.auth
	$scope.loginUser = function(form) {
		// login user
		username = form.username.$viewValue;
		password = form.password.$viewValue;

		User.loginUser(username, password, function(resp) {
			if(resp.success) {
				$ionicPopup.alert({
					title: 'Success',
					template: resp.message
				}).then(function(res){
					console.log("Login Success!");
					// registration is success and session is now set,
					// so lets redirect to discover page
					$state.go('app.home');
				});
			} else {
				// error
				isValid = false;
				$ionicPopup.alert({
					title: 'Error',
					template: resp.message
				}).then(function(res){
					console.log("Login Failed!");
				});
			}
		});
	}

	// attempt to register user
	$scope.registerUser = function(form_field) {
		// form field
		var form = {
				firstname: form_field.firstname.$viewValue,
				lastname: form_field.lastname.$viewValue,
				email: form_field.email.$viewValue,
				username: form_field.username.$viewValue,
				password: form_field.password.$viewValue
			}

		// check availability of username and email
		var isValid = true;
		User.checkUsername(form.username, function(resp) {
			if(resp.success) {
				if(resp.message != 'true') {
					// username already used
					isValid = false;
					$ionicPopup.alert({
						title: 'Error',
						template: 'Username already used!'
					}).then(function(res){
						console.log("Username already used!");
					});
				}
			} else {
				// server error
				isValid = false;
				$ionicPopup.alert({
					title: 'Error',
					template: resp.message
				}).then(function(res){
					console.log("Server Error!");
				});
			}
		}).then(function(){
			if(isValid === true) {
				User.checkEmail(form.email, function(resp) {
					if(resp.success) {
						if(resp.message != 'true') {
							// email already used
							isValid = false;
							$ionicPopup.alert({
								title: 'Error',
								template: 'Email already used!'
							}).then(function(res){
								console.log("Email already used!");
							});
						}
					} else {
						// server error
						isValid = false;
						$ionicPopup.alert({
							title: 'Error',
							template: resp.message
						}).then(function(res){
							console.log("Server Error!");
						});
					}
				}).then(function(){
					if (isValid) {
						// Register User
						User.registerUser(form, function(resp) {
							if(resp.success) {
								$ionicPopup.alert({
									title: 'Success',
									template: resp.message
								}).then(function(res){
									console.log("Registration Success!");
									// registration is success and session is now set,
									// so lets redirect to discover page
									$state.go('app.home');
								});
							} else {
								// error
								isValid = false;
								$ionicPopup.alert({
									title: 'Error',
									template: resp.message
								}).then(function(res){
									console.log("Registration Error!");
								});
							}
						}); // registerUser
					};
				}); // checkEmail
			}
		}); // checkUsername
	}

})

.controller('MainCtrl', function($scope, $ionicSideMenuDelegate, User, $window, $ionicHistory, $state) {

	$scope.logout = function() {
		User.destroySession();
		console.log('clicked!');

		// instead of using $state.go, we're going to redirect.
		// reason: we need to ensure views aren't cached.
		$window.location.href = 'index.html';
	}

	$scope.gotoState = function(state) {
		$state.go(state);
		$ionicHistory.nextViewOptions({
			historyRoot: false,
			disableAnimate: false,
			expire: 300
		});
	}

})

.controller('HomeCtrl', function($scope,$ionicHistory) {
	$ionicHistory.clearHistory();
})

.controller('ProfileCtrl', function($scope) {

});