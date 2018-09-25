angular
.module('module.webservice', [])
.factory("webservice", ['$http', '$rootScope', 'settings', 'messenger',
	function($http, $rootScope, settings, messenger) {

	const webservice = {};

        webservice.userData = {'username': null, 'password': null};
        webservice.authenticateUser = function (userData) {
            webservice.userData = userData;
            return webservice.get('user/' + userData.username, 'GET', null);
        };
        webservice.logUserOut = function () {
            webservice.userData = {'username': null, 'password': null};
        };

    webservice.get = function(endpoint, method, data) {

        const params = {
            url:   angular.isArray(endpoint)
                ? settings[endpoint[0]] + endpoint[1]
                : settings.server_url + endpoint,
            method:     method || "get",
            data:       data || {}
        };
        if (webservice.userData.username && webservice.userData.password) {
            params.headers = {
                "Authorization": "Basic " + window.btoa(webservice.userData.username + ":" + webservice.userData.password)
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
                    console.log(err);
                    let errText = endpoint + ": " + err.status + " " + err.statusText;
                    if (angular.isDefined(err.data) && (err.data !== null)) {
                        if (angular.isDefined(err.data.warnings)) err.data.warnings.forEach(messenger.warning);
                        if (angular.isDefined(err.data.message)) errText = err.data.message;
                    }
                    if (err.status === -1) errText = "No Backend Found!";
                    messenger.error(errText);
                    $rootScope.$broadcast('refreshView');
                    reject(errText);
                }
            )
        })
    };


	return webservice;
}]);
