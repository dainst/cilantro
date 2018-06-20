angular
.module('directive.multiselect', ['ng'] )
.directive('multiselect' , ['$log', function ($log) {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			'elements': '='
		},
		templateUrl: 'partials/elements/multiselect.html',
		link: function(scope, element, attrs) {
			scope.toggled = true;
			scope.toggleList  = function() {
				scope.toggled = !scope.toggled;
			}
		}

	}
}]);