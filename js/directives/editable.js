'use strict';

angular

.module('directive.editable', [])

.directive('editable', ['settings', function(settings) {
	
	const killCache = '?nd=' + Date.now();
	
	return {
      template: '<ng-include src="getTemplateUrl()" ng-click="debug()"/>',
      restrict: 'A',
      scope: {
        'item': '='
      },
      link: function(scope, elem, attrs) {  	  
    	  scope.id = 'ID#' + Math.random();
    	  scope.caption = attrs.caption;
    	  scope.getTemplateUrl = function() {
    		  if (angular.isUndefined(scope.item) || angular.isUndefined(scope.item.type) || scope.item.readonly) {
    			  return 'partials/editable_undefined.html' + killCache;
    		  }
	    	  return 'partials/editable_' + scope.item.type + '.html'  + killCache;
    	  };
    	  scope.debug = function() {
            if (settings.devMode()) {
                console.log('Editable Content: ', scope.item);
            }
		  }
      }
	}
  }
]);