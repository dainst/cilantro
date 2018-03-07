angular
.module('module.settings', [])
.factory("settings", ['$log', '$http', function($log, $http) {
	
	var settings = window.settings; // @ TODO better settings implementation!

	$http.get('version.json').then(function(response) {
		return settings.versionInfo = response.data;
	}, function errorCallback(err) {
		console.error(err);
    });

	return settings;

}]);
