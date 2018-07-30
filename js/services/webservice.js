angular
.module('module.webservice', [])
.factory("webservice", ['$http', '$rootScope', 'settings', 'messenger',
	function($http, $rootScope, settings, messenger) {

	const webservice = {};

    webservice.get = function(endpoint, method, data) {

        const params = {
            url:   angular.isArray(endpoint)
                ? settings[endpoint[0]] + endpoint[1]
                : settings.server_url + endpoint,
            method:     method || "get",
            data:       data || {}
        };
        if (angular.isDefined(settings.server_user) && angular.isDefined(settings.server_pass)) {
            params.headers = {
                "Authorization": "Basic " + window.btoa(settings.server_user + ":" + settings.server_pass)
            };
        }

        return new Promise(function(resolve, reject) {
            $http(params).then(
                response => {
                    console.log("response", response);
                    if (response.data.success === false) {
                        messenger.error(response.message);
                        $rootScope.$broadcast('refreshView');
                        reject(response.message);
                    } else {
                        $rootScope.$broadcast('refreshView');
                        resolve(response.data);
                    }
                },
                err => {
                    if (angular.isDefined(err.data) && angular.isDefined(err.data.warnings)) {
                        err.data.warnings.forEach(messenger.warning);
                    }
                    let errText = endpoint + ": " + err.status + " " + err.statusText;
                    console.log(err);
                    if (angular.isDefined(err.data) && angular.isDefined(err.data.message)) {
                        errText = err.data.message;
                    }
                    messenger.error(errText);
                    $rootScope.$broadcast('refreshView');
                    reject(errText);
                }
            )
        })
    };


	return webservice;
}]);
