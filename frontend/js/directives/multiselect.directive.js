angular
.module('directive.multiselect', ['ng'] )
.directive('multiselect' , [function () {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			'elements': '='
		},
		templateUrl: 'js/directives/multiselect.html',
		link: function(scope, element, attrs) {
			scope.toggled = true;
			scope.toggleList  = function() {
				scope.toggled = !scope.toggled;
			}
		}

	}
}]);