'use strict';
/**
 * 
 * controller for journal-specific step 2 without pdf analysis
 * 
 * 
 */

angular

.module('controller.nopdf', [])

.controller('nopdf', ['$scope', '$log', 'journalmaster', 'settings', function($scope, $log, journalmaster, settings) {
	
	function refresh() {
		//$log.log('refresh');
		$scope.$apply();
	}
	
	journalmaster.control.start();
}]);