/* global angular, document, window */
'use strict';

angular.module('infoCrud.controllers', [
		'ionic'
	])

// Main App Controller
.controller('appCtrl', function($scope, $window, $ionicModal, $ionicPopover, $timeout, User) {

	$scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    // logout the user
    $scope.logout = function() {
		User.destroySession();
		console.log('logout!');

		// instead of using $state.go, we're going to redirect.
		// reason: we need to ensure views aren't cached.
		$window.location.href = '';
	}

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

// Side Menu Controller
.controller('menuCtrl', function(ionicMaterialInk) {
	// Set Ink
    ionicMaterialInk.displayEffect();
})

// Main Page [Login/Register] Controller
.controller('mainCtrl', function($scope, $ionicHistory, $ionicPopup, $cordovaToast, $state, User, ionicMaterialInk) {
    // Clear History for back button
	$ionicHistory.clearHistory();

	// show login page at first
	$scope.isRegister = false;

	// attempt to login
	$scope.loginUser = function(form) {
		// login user
		var username = form.username.$viewValue;
		var password = form.password.$viewValue;

		User.loginUser(username, password, function(resp) {
			if(resp.success) {
				$ionicPopup.alert({
					title: 'Success',
					template: resp.message
				}).then(function(res){
					console.log("Login Success!");
					// registration is success and session is now set,
					// so lets redirect to home page
					$state.go('app.home');
				});
				// $cordovaToast
				// 	.show('Login Success!', 'long', 'bottom')
				// 	.then(function(success) {
				// 		// login is success and session is now set,
				// 		// so lets redirect to home page
				// 		$state.go('app.home');
				// 	}, function (error) {
				// 		// error
				// 		console.log('error on displaying ')
				// 	});
			} else {
				error
				$ionicPopup.alert({
					title: 'Error',
					template: resp.message
				}).then(function(res){
					console.log("Login Failed!");
				});
				// $cordovaToast
				// 	.show(resp.message, 'long', 'bottom')
				// 	.then(function(success) {
				// 		console.log("Login Failed!");
				// 	}, function (error) {
				// 		// error
				// 		console.log('error on displaying ')
				// 	});
			}
		});
	};

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
					// $cordovaToast
					// 	.show('Username already used!', 'long', 'bottom')
					// 	.then(function(success) {
					// 		console.log("Username already used!");
					// 	}, function (error) {
					// 		// error
					// 		console.log('error on displaying ')
					// 	});
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
				// $cordovaToast
				// 	.show(resp.message, 'long', 'bottom')
				// 	.then(function(success) {
				// 		console.log("Server Error!");
				// 	}, function (error) {
				// 		// error
				// 		console.log('error on displaying ')
				// 	});
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
							// $cordovaToast
							// 	.show('Email already used!', 'long', 'bottom')
							// 	.then(function(success) {
							// 		console.log("Email already used!");
							// 	}, function (error) {
							// 		// error
							// 		console.log('error on displaying ')
							// 	});
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
						// $cordovaToast
						// 	.show(resp.message, 'long', 'bottom')
						// 	.then(function(success) {
						// 		console.log("Server Error!");
						// 	}, function (error) {
						// 		// error
						// 		console.log('error on displaying ')
						// 	});
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
									// so lets redirect to home page
									$state.go('app.home');
								});
								// $cordovaToast
								// 	.show(resp.message, 'long', 'bottom')
								// 	.then(function(success) {
								// 		console.log("Registration Success!");
								// 		// registration is success and session is now set,
								// 		// so lets redirect to home page
								// 		$state.go('app.home');
								// 	}, function (error) {
								// 		// error
								// 		console.log('error on displaying ')
								// 	});
							} else {
								// error
								isValid = false;
								$ionicPopup.alert({
									title: 'Error',
									template: resp.message
								}).then(function(res){
									console.log("Registration Error!");
								});
								// $cordovaToast
								// 	.show(resp.message, 'long', 'bottom')
								// 	.then(function(success) {
								// 		console.log("Registration Error!");
								// 	}, function (error) {
								// 		// error
								// 		console.log('error on displaying ')
								// 	});
							}
						}); // registerUser
					};
				}); // checkEmail
			}
		}); // checkUsername
	};

	// Set Ink
	ionicMaterialInk.displayEffect();
})

// Homepage Controller
.controller('homeCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
	$scope.$parent.showHeader();
	$scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');

	$timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();
})

// Profile Page Controller
.controller('profileCtrl', function($scope, $stateParams, $state, $timeout, $ionicActionSheet, $ionicPopup, $cordovaToast, ionicMaterialMotion, ionicMaterialInk, User, Camera) {
	// Set Header
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $scope.fullName = User.getUserFullName();
    $scope.username = User.getUsername();
    $scope.profPicUrl = User.getProfilePictureUrl();

    // Pictures Button Click Event
	$scope.showCoverPhotoOption = function() {
		// Show the action sheet
		$ionicActionSheet.show({
			titleText: 'Change Your Cover Photo',
			buttons: [
				{ text: '<b>Share</b> This' },
				{ text: 'Move' }
			],
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				console.log(index);
				return true;
			}
		});
	};
    // Pictures Button Click Event
	$scope.showProfilePhotoOption = function() {
		// Show the action sheet
		$ionicActionSheet.show({
			titleText: 'Change Your Profile Picture',
			buttons: [
				{ text: 'Capture via <b>Camera</b>' },
				{ text: 'Upload from Gallery' }
			],
			cancelText: 'Cancel',
			cancel: function() {
				// add cancel code..
			},
			buttonClicked: function(index) {
				if(index == 0) {
					// Camera Action/Service
					Camera.getPicture().then(function(imageURI) {
						// Update User Profile Picture
						User.updateProfilePicture(imageURI, function(resp) {
							if(resp.success) {
								$ionicPopup.alert({
									title: 'Success',
									template: resp.message
								}).then(function(res){
									console.log("Save Change!");
									// lets redirect to profile page
									$state.go('app.profile',{},{reload: true});
								});
								// $cordovaToast
								// 	.show(resp.message, 'long', 'bottom')
								// 	.then(function(success) {
								// 		console.log("Registration Success!");
								// 		// registration is success and session is now set,
								// 		// so lets redirect to home page
								// 		$state.go('app.home');
								// 	}, function (error) {
								// 		// error
								// 		console.log('error on displaying ')
								// 	});
							} else {
								// error
								$ionicPopup.alert({
									title: 'Error',
									template: resp.message
								}).then(function(res){
									console.log("Nothing Updated!");
									$state.go('app.profile',{},{reload: true});
								});
								// $cordovaToast
								// 	.show(resp.message, 'long', 'bottom')
								// 	.then(function(success) {
								// 		console.log("Registration Error!");
								// 	}, function (error) {
								// 		// error
								// 		console.log('error on displaying ')
								// 	});
							}
						}); // updateProfilePicture
					}, function(err) {
						// camera get picture error
						console.log(err);
					}, {
						quality: 75,
						targetWidth: 320,
						targetHeight: 320,
						saveToPhotoAlbum: false
					});
				} else if(index == 1) {
					console.log('gallery is choosen');
				}
				return true;
			}
		});
	};

    // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
})

// Profile Setting Controller
.controller('profileSettingCtrl', function ($scope, $ionicModal, $state, $ionicHistory, $ionicPopup, $cordovaToast, User) {
	$scope.form = User.getUserDetail();

	$ionicModal.fromTemplateUrl('templates/profileSetting.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.profileSetting = function(form_field) {
		// form field
		var form = {
				first_name: form_field.firstname.$viewValue,
				last_name: form_field.lastname.$viewValue,
				gender: form_field.gender.$viewValue
			}
		form.gender = (form.gender == '0') ? 'Male' : 'Female';

		// Update User Profile
		User.updateUserProfile(form, function(resp) {
			if(resp.success) {
				$ionicPopup.alert({
					title: 'Success',
					template: resp.message
				}).then(function(res){
					console.log("Save Change!");
					// lets redirect to profile page
					$scope.modal.hide();
					$ionicHistory.clearCache()
					$state.go('app.profile',{},{reload: true});
				});
				// $cordovaToast
				// 	.show(resp.message, 'long', 'bottom')
				// 	.then(function(success) {
				// 		console.log("Registration Success!");
				// 		// registration is success and session is now set,
				// 		// so lets redirect to home page
				// 		$state.go('app.home');
				// 	}, function (error) {
				// 		// error
				// 		console.log('error on displaying ')
				// 	});
			} else {
				// error
				$ionicPopup.alert({
					title: 'Error',
					template: resp.message
				}).then(function(res){
					console.log("Nothing Updated!");
					$scope.modal.hide();
					$ionicHistory.clearCache()
					$state.go('app.profile',{},{reload: true});
				});
				// $cordovaToast
				// 	.show(resp.message, 'long', 'bottom')
				// 	.then(function(success) {
				// 		console.log("Registration Error!");
				// 	}, function (error) {
				// 		// error
				// 		console.log('error on displaying ')
				// 	});
			}
		}); // updateUserProfile
	}
});