/**
 * Created by pfranck on 19.04.17.
 */

angular
	.module('directive.multiselect', ['ng'] )
	.directive('multiselect' , ['$log', function ($log) {
		return {
			restrict: 'E',
			transclude: true,
			scope: {
				'elements': '='
			},
			templateUrl: 'partials/element-multiselect.html',
			link: function(scope, element, attrs) {
				scope.toggled = true;
				scope.toggleList  = function() {
					scope.toggled = !scope.toggled;
				}
			}

		}
	}]);