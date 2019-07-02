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
                return settings;
            });
        }

        settings.get = () => {
            if (loaded) return Promise.resolve(settings);
            else return settings.load();
        }

        return settings;

    }]);
