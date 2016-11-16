'use strict';

angular

.module('directive.editable', [])

.directive('editable', ['$log', function($log) {
	
	var killCache = '?nd=' + Date.now();
	
	return {
      template: '<ng-include src="getTemplateUrl()" />',
      restrict: 'A',
      scope: {
        'item': '='
      },
      link: function(scope, elem, attrs) {  	  
    	  scope.id = 'ID#' + Math.random();
    	  scope.caption = attrs.caption;
		  
    	  
    	  scope.getTemplateUrl = function() {  		  
    		  if (angular.isUndefined(scope.item) || angular.isUndefined(scope.item.type) || scope.item.readonly) {
    			  //$log.log(scope.item);
    			  return 'partials/undefined.html' + killCache;
    		  }
	    	  return 'partials/' + scope.item.type + '.html'  + killCache; 
    	  }
    	  
      }
	}
  }
]);