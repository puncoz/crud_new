angular.module('crud.directives', [
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
})

// comparing two form field
.directive("compareTo",function() {
  return {
    require: "ngModel",
    scope: {
      otherModelValue: "=compareTo"
    },
    link: function(scope, element, attributes, ngModel) {

      ngModel.$validators.compareTo = function(modelValue) {
        return modelValue == scope.otherModelValue;
      };

      scope.$watch("otherModelValue", function() {
        ngModel.$validate();
      });
    }
  };
})

// load side menu
.directive("ionSidenav", function() {
	return {
		restrict : "E",
		templateUrl : "templates/sideNav.html"
	}
});