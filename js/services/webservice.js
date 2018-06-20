angular
.module('module.webservice', [])
.factory("webservice", ['$http', '$rootScope', 'settings', 'messenger', 'repository',
	function($http, $rootScope, settings, messenger, repository) {

	let webservice = {};

	webservice.sec = {
		password: settings.password || ''
	};

    webservice.get = function(endpoint, method, data) {

        endpoint = angular.isArray(endpoint) ? settings[endpoint[0]] + endpoint[1] : settings.server_url + endpoint;
        method = method || "get";
        data = data || {};

        return new Promise(function(resolve, reject) {
            $http({
                method:	method,
                url: endpoint,
                data: data
            }).then(
                function(response) {
                    console.log("response", response);
                    if (response.data.success === false) {
                        messenger.error(response.message);
                        reject(response.message);
                    } else {
                        resolve(response.data);
                    }
                },
                function(err) {
                    messenger.error(endpoint + ": " + err.status + " " + err.statusText);
                    reject(endpoint + ": " + err.status + " " + err.statusText);
                }
            )
        })
    };


	return webservice;
}]);
