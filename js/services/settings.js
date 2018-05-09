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
                //messenger.error("Version Info could not be loaded!");
            });
        }, function errorCallback(err) {
            console.error(err);
            //messenger.error("Settings file could not be loaded!");
        });


    settings.devMode = function() {
        return (typeof settings.password !== "undefined");
    };

	return settings;

}]);
