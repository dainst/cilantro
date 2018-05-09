angular
.module('module.settings', [])
.factory("settings", ['$http', function($http) {
	
	let settings = angular.extend({}, window.settings); // @ TODO better settings implementation!

	$http.get('version.json').then(function(response) {
		return settings.versionInfo = response.data;
	}, function errorCallback(err) {
		console.error(err);
    });

    settings.devMode = function() {
        return (typeof settings.password !== "undefined");
    };

	return settings;

}]);
