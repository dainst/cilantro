angular
    .module('module.cookiemanager', [])
    .factory('cookiemanager', ['$http', '$rootScope', function ($http, $rootScope) {
        const cookiemanager = {};
        cookiemanager.getCookie = function (name) {
            let re = new RegExp(name + "=([^;]+)");
            let value = re.exec(document.cookie);
            return (value != null) ? JSON.parse(unescape(value[1])) : null;
        };
        cookiemanager.setCookie = function (name, value, days=5) {
            let date = new Date(Date.now()+days*24*60*60*1000);
            document.cookie = name + "=" + JSON.stringify(value)+";"+"expires="+date.toUTCString();
        };
        cookiemanager.deleteCookie= function (name) {
            document.cookie = name + "=;";
        };
        return cookiemanager;
    }]);
