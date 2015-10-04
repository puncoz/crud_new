// Ionic InfoCrud App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
'use strict';
angular.module('infoCrud', [
			'ionic'
		,	'ngCordova'
		,	'ngMessages'
		,	'infoCrud.controllers'
		,	'infoCrud.directives'
		,	'infoCrud.services'
		,	'ionic-material'
		,	'ionMdInput'
	])

.run(function($ionicPlatform, $cordovaSplashscreen, $rootScope, $cordovaNetwork, $ionicPopup) {
	$ionicPlatform.ready(function() {
	    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
	    // for form inputs)
		if(window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if(window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}

		// listen for Offline event
		$rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
			var offlineState = networkState;
			$ionicPopup.confirm({
				title: "Internet Disconnected",
				content: "The internet is disconnected on your device."
			}).then(function(result) {
				if(!result) {
					ionic.Platform.exitApp();
				}
			});
		});

		// SplashScreen
		// Uncomment this and change "AutoHideSplashScreen" to false in config.xml
		// hide 5 seconds after running
		// setTimeout(function() {
		// 	$cordovaSplashscreen.hide()
		// }, 5000);
		// on resolution of some promise
		// MyDataService.getThings().then(function(data) {
		// 	$cordovaSplashscreen.hide()
		// });
	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
	// Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

	// Ionic uses AngularUI Router, which uses the concept of states.
	// Learn more here: https://github.com/angular-ui/ui-router.
	// Set up the various states in which the app can be.
	// Each state's controller can be found in controllers.js.
	$stateProvider

	// Main screen
	.state('main', {
		url: '/',
		views: {
			'mainView': {
				templateUrl: 'templates/main.html',
				controller: 'mainCtrl'
			}
		},
		onEnter: function($state, User) {
			User.checkSession().then(function(hasSession) {
				if(hasSession) $state.go('app.home');
			});
		}
	})

	// Set up an abstract state for the side menus directive:
	.state('app', {
		url: '/app',
		abstract: true,
		views: {
			'mainView': {
				templateUrl: 'templates/app.html',
				controller: 'appCtrl'
			}
		},

		// don't load the state until we've populated our user, if necessary.
		resolve: {
			populateSession: function(User) {
				return User.checkSession();
			}
		},
		onEnter: function($state, User) {
			User.checkSession().then(function(hasSession) {
				if(!hasSession) $state.go('main')
			});
		}
	})

	.state('app.home', {
        url: '/home',
        views: {
            'mainContent': {
                templateUrl: 'templates/home.html',
                controller: 'homeCtrl'
            },
            'fabContent': {
                template: '<button id="fab-activity" class="button button-fab button-fab-top-right expanded button-energized-900 flap"><i class="icon ion-paper-airplane"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-activity').classList.toggle('on');
                    }, 200);
                }
            },
			'sideMenu': {
				templateUrl: 'templates/menu.html',
                controller: 'menuCtrl'
			}
        }
    })

	.state('app.profile', {
        url: '/profile',
        views: {
            'mainContent': {
                templateUrl: 'templates/profile.html',
                controller: 'profileCtrl'
            },
            'fabContent': {
                template: '<button id="fab-profile" class="button button-fab button-fab-bottom-right button-dark" ng-click="modal.show()"><i class="icon ion-compose"></i></button>',
                controller: 'profileSettingCtrl'
            },
			'sideMenu': {
				templateUrl: 'templates/menu.html',
                controller: 'menuCtrl'
			}
        }
    })

	// If none of the above states are matched, use this as the fallback:
	$urlRouterProvider.otherwise('/');

})

.constant('SERVER', {
	// server url
	url: 'http://192.168.40.50:82/ionic_projects/crud/api/'
})
.constant('USER_DIR', {
	// relative url to the profile picture
	pp: 'user/img/pp/',
	cp: 'user/img/cp/'
});