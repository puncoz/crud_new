

angular.module('infoCrud.directives', [
		'ionic',
	])

// load login page
.directive("ionLogin", function() {
	return {
		restrict : "E",
		templateUrl : "templates/login.html"
	}
})
// load Register page
.directive("ionRegister", function() {
	return {
		restrict : "E",
		templateUrl : "templates/register.html"
	}
});