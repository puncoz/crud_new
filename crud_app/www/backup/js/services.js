angular.module('crud.services', [
		'crud.utils',
	])

.factory('User', function($http, SERVER, $localstorage, $q) {
	var o = {
		username: false,
		session_id: false
	};

	// check for registered username
	o.checkUsername = function(username, callback) {
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
		return $http.post(SERVER.url + 'user/register_user', form)
			.success(function(response) {
				if(response.status == '200') {
					if(response.msg != 'false') {
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

	// login user
	o.loginUser = function(username, password, callback) {
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
		if(username) o.username = username;
		if(session_id) o.session_id = session_id;

		// set data in localstorage object
		$localstorage.setObject('user', {
			username: username,
			session_id: session_id
		});
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

			if(user.username) {
				// do something
				defer.resolve(true);
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
		o.username = false;
		o.session_id = false;
	}

	return o;
});