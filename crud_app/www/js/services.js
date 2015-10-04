'use strict';

angular.module('infoCrud.services', [
		'infoCrud.utils',
	])

// User Services
.factory('User', function($http, $localstorage, $q, SERVER, USER_DIR) {

	var o = {
		username: '',
		first_name: '',
		middle_name: '',
		last_name: '',
		gender: '',
		profilePic: '',
		session_id: ''
	};

	// get User Full Name
	o.getUserFullName = function() {
		return o.first_name + ' ' + o.middle_name + ' ' + o.last_name;
	}

	// get Username
	o.getUsername = function() {
		return o.username;
	}

	// get Gender
	o.getGender = function() {
		return o.gender;
	}

	// get URL of Profile Picture
	o.getProfilePictureUrl = function() {
		var pic;
		if(o.profilePic == '') {
			pic = USER_DIR.pp + "prof-pic-default-" + o.gender + ".png";
		} else {
			pic = o.profilePic
		}
		return pic;
	}

	// get user details
	o.getUserDetail = function() {
		return {
				username: o.username,
				firstname: o.first_name,
				middlename: o.middle_name,
				lastname: o.last_name,
				gender: o.gender,
				profilePic: o.profilePic
			};
	}

	// check for registered username
	o.checkUsername = function(username, callback) {
		var resp;
		return $http.post(SERVER.url + 'user/check_username', {username: username})
			.success(function(response) {
				if(response.status == '200') {
					resp = { success: true, message: response.msg };
				} else {
					resp = { success: false, message: "Error connecting server!" };
				}
				callback(resp);
			});
	}

	// check for registered Email
	o.checkEmail = function(email, callback) {
		var resp;
		return $http.post(SERVER.url + 'user/check_email', {email: email})
			.success(function(response) {
				if(response.status == '200') {
					resp = { success: true, message: response.msg };
				} else {
					resp = { success: false, message: "Error connecting server!" };
				}
				callback(resp);
			});
	}

	// register new user
	o.registerUser = function(form, callback) {
		var resp;
		return $http.post(SERVER.url + 'user/register_user', form)
			.success(function(response) {
				if(response.status == '200') {
					if(response.msg != 'false') {
						// login new registered user
						o.setSession(form.username, response.msg);
						resp = { success: true, message: "User Registration Success!" };
					} else {
						resp = { success: false, message: "User Registration Failed!" };
					}
				} else {
					resp = { success: false, message: "Error connecting server!" };
				}
				callback(resp);
			});
	}

	// update user profile
	o.updateUserProfile = function(form, callback) {
		var resp;
		form.session_id = o.session_id;
		return $http.post(SERVER.url + 'user/update_user_profile', form)
			.success(function(response) {
				if(response.status == '200') {
					if(response.msg == 'true') {
						// update user information
						o.first_name = form.first_name;
						o.last_name = form.last_name;
						o.gender = (form.gender == 'Male') ? '0' : '1';
						resp = { success: true, message: "User Profile Update Success!" };
					} else if(response.msg == 'false') {
						// update user information
						resp = { success: false, message: "User Profile Update Failed!" };
					} else {
						resp = { success: false, message: response.msg };
					}
				} else {
					resp = { success: false, message: "Error connecting server!" };
				}
				callback(resp);
			});
	}

	// update user profile picture
	o.updateProfilePicture = function(imageURI, callback) {
		var resp;
		return $http.post(SERVER.url + 'user/update_user_profile_picture', {image: imageURI, session_id: o.session_id})
			.success(function(response) {
				if(response.status == '200') {
					if(response.msg == 'true') {
						// update user information
						o.profilePic = imageURI;
						resp = { success: true, message: "Profile Picture Updated Successfully!" };
					} else if(response.msg == 'false') {
						// update user information
						resp = { success: false, message: "Profile Picture Update Failed!" };
					} else {
						resp = { success: false, message: response.msg };
					}
				} else {
					resp = { success: false, message: "Error connecting server!" };
				}
				callback(resp);
			});
	}

	// login user
	o.loginUser = function(username, password, callback) {
		var resp;
		return $http.post(SERVER.url + 'user/login_user', {username: username, password: password})
			.success(function(response) {
				if(response.status == '200') {
					if(response.msg != 'false') {
						o.setSession(username, response.msg);
						resp = { success: true, message: "Login Success!" };
					} else {
						resp = { success: false, message: "Login Failed!" };
					}
				} else {
					resp = { success: false, message: "Error connecting server!" };
				}
				callback(resp);
			});
	}

	// set user session
	o.setSession = function(username, session_id) {
		var defer = $q.defer();

		// fetch userdata first
		$http.post(SERVER.url + 'user/get_user_details', {session_id: session_id})
			.success(function(response) {
				if(response.status == '200') {
					if(response.msg != 'false') {
						o.first_name = response.msg.first_name;
						o.last_name = response.msg.last_name;
						o.gender = (response.msg.gender == 'Male') ? '0' : '1';
						o.profilePic = response.msg.profile_picture;
					} else {
						defer.resolve(false);
					}
				}
			});

		// set session
		if(username) o.username = username;
		if(session_id) o.session_id = session_id;

		// set data in localstorage object
		$localstorage.setObject('user', {
			username: username,
			session_id: session_id
		});

		defer.resolve(true);
		return defer.promise;
	}

	// check if there's a user session present
	o.checkSession = function() {
		var defer = $q.defer();

		if(o.session_id) {
			// if this session is already initialized in the service
			defer.resolve(true);
		} else {
			// detect if there's a session in localstorage from previous use
			// id it is, pull into our service
			var user = $localstorage.getObject('user');

			if(user.username && user.session_id) {
				// check whether these login is correct or not
				var res = o.setSession(user.username, user.session_id);
				if(res) {
					defer.resolve(true);
				} else {
					defer.resolve(false);
				}
			} else {
				// no user info in localstorage, reject
				defer.resolve(false);
			}
		}

		return defer.promise;
	}

	// wipe out our session data
	o.destroySession = function() {
		$localstorage.setObject('user', {});
		o.username = '';
		o.session_id = '';
	}

	return o;

})

// Camera Services
.factory('Camera', ['$q', function($q) {

	var o = {};

	// get picture from camera
	o.getPicture = function(options) {
		var q = $q.defer();

		navigator.camera.getPicture(function(result) {
			// Do any magic you need
			q.resolve(result);
		}, function(err) {
			q.reject(err);
		}, options);

		return q.promise;
	}

	return o;

}]);