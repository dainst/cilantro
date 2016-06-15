'use strict';

angular.module('idai.components')

/** 
 * @author: Sebastian Cuy
 */

 .directive('idaiForm', function() {
	return {
		restrict: 'E',
        transclude: true,
		scope: {
			submit: '&', doc: '='
		},
		templateUrl: 'partials/directives/idai-form.html',
		link: function(scope, elem, attrs) {

			scope.reset = function() {
				scope.doc = {};
			};

		}
	}
});
