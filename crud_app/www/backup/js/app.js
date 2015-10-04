// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('crud', [
		'ionic',
		'ngCordova',
		'ngMessages',
		'crud.controllers',
		'crud.directives',
		'crud.services',
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
		templateUrl: 'templates/main_app.html',
		controller: 'AppCtrl',
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
		templateUrl: 'templates/app.html',

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
			'appContent': {
				templateUrl: 'templates/home.html',
				controller: 'HomeCtrl'
			}
		}
	})

	.state('app.profile', {
		url: '/profile',
		views: {
			'appContent': {
				templateUrl: 'templates/profile.html',
				controller: 'ProfileCtrl'
			}
		}
	})

	// If none of the above states are matched, use this as the fallback:
	$urlRouterProvider.otherwise('/');

})

.constant('SERVER', {
	// server url
	url: 'http://192.168.40.50:82/ionic_projects/crud/api/'
});