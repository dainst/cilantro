angular
.module('module.settings', [])
.factory("settings", ['$log', '$http', function($log, $http) {
	
	var settings = {};

	return window.settings;

}]);
