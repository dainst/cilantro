angular
.module('module.settings', [])
.factory("settings", ['$http', function($http) {
	
	let settings = {};

    settings.load = new Promise(function(resolve, reject) {
        $http.get('config/settings.json')
            .then(function(response) {
                settings = angular.extend(settings, response.data);
                $http.get('version.json').then(function(response) {
                    settings.versionInfo = response.data;
                    console.log('settings', settings);
                    resolve();
                }, reject);
            }, reject)
    });


    settings.devMode = function() {
        return (typeof settings.password !== "undefined");
    };

    settings.testMode = function() {
      return (typeof settings.test !== "undefined") && settings.test;
    };

	return settings;

}]);
