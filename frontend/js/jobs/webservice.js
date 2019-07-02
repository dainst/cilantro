angular.module('workbench.jobs')

    .factory("webservice", ['$http', '$rootScope', 'settings', 'messenger',
        function($http, $rootScope, settings, messenger) {

            const webservice = {};

            webservice.userData = {
                'username': null,
                'btoa': null,
                'uriComponent': null
            };
            webservice.authenticateUser = function(username, password) {
                webservice.setUserData(username, password);
                return webservice.get('user/' + username, 'GET', null);
            };
            webservice.setUserData = function(username, password) {
                webservice.userData.username = username;
                webservice.userData.btoa = window.btoa(username + ":" + password);
                webservice.userData.uriComponent = encodeURIComponent(username) + ":" + encodeURIComponent(password);
            };
            webservice.logUserOut = function() {
                webservice.userData = {
                    'username': null,
                    'password': null
                };
            };
            webservice.isLoggedIn = function() {
                return webservice.userData.username && webservice.userData.btoa;
            };

            webservice.get = function(endpoint, method, data) {
                return settings.get().then(settings => {
                    const params = {
                        url: angular.isArray(endpoint) ?
                            settings[endpoint[0]] + endpoint[1] : settings.server_url + endpoint,
                        method: method || "get",
                        data: data || {}
                    };
                    if (webservice.isLoggedIn()) {
                        params.headers = {
                            "Authorization": "Basic " + webservice.userData.btoa
                        };
                    }

                    return $http(params).then(response => {
                        console.log("response", response);
                        if (response.data.success === false) {
                            messenger.error(response.message);
                            $rootScope.$broadcast('refreshView');
                            return Promise.reject(response.message);
                        } else {
                            $rootScope.$broadcast('refreshView');
                            return response.data;
                        }
                    }, err => {
                        console.log(err);
                        let errText = endpoint + ": " + err.status + " " + err.statusText;
                        if (angular.isDefined(err.data) && (err.data !== null)) {
                            if (angular.isDefined(err.data.warnings)) err.data.warnings.forEach(messenger.warning);
                            if (angular.isDefined(err.data.message)) errText = err.data.message;
                        }
                        if (err.status === -1) errText = "No Backend Found!";
                        messenger.error(errText);
                        $rootScope.$broadcast('refreshView');
                        return Promise.reject(errText);
                    });
                });
            };

            return webservice;
        }
    ]);
