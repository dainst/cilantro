angular
.module('module.settings', [])
.factory("settings", ['$http', function($http) {
	
	let settings = {};

    settings._loaded =
        $http.get('settings.json').then(function(response) {
            settings = angular.extend(settings, response.data);
            $http.get('version.json').then(function(response) {
                settings.versionInfo = response.data;
                console.log('settings', settings);
            }, function errorCallback(err) {
                console.error(err);
            });
        }, function errorCallback(err) {
            console.error(err);
            alert("settings file not available");
        });


    settings.devMode = function() {
        return (typeof settings.password !== "undefined");
    };

    settings.testMode = function() {
      return (typeof settings.test !== "undefined") && settings.test;
    };

	return settings;

}]);
