angular.module('workbench')

	.factory("settings", ['$http', function($http) {

		let loaded = false;
		let settings = {};

	    settings.load = () => {
	        return $http.get('config/settings.json').then(response => {
                settings = angular.extend(settings, response.data);
				return $http.get('version.json');
			}).then(response => {
				settings.versionInfo = response.data;
				console.log('settings', settings);
				return settings;
			});
	    }

		settings.get = () => {
			if (loaded) return Promise.resolve(settings);
			else return settings.load();
		}


	    settings.devMode = function() {
	        return (typeof settings.password !== "undefined");
	    };

	    settings.testMode = function() {
	      return (typeof settings.test !== "undefined") && settings.test;
	    };

		return settings;

	}]);
