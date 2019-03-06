'use strict';

angular

.module('workbench', [

    'ui.bootstrap',
    'ngFileUpload',
    'ui.router',

    'idai.components',
    'idai.templates',

    'workbench.jobs',
    'workbench.jobs.wizard',
    'workbench.modals',
    'workbench.models',
    'workbench.utils'
])

.config(['$urlRouterProvider', function($urlRouterProvider){
    $urlRouterProvider.when('', '/');
}])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state({
            name: 'home',
            url: '/',
            templateUrl: 'js/home.html'
        })
        .state({
            name: 'jobs-list',
            url: '/jobs',
            templateUrl: 'js/jobs/jobs.html',
        })
        .state( {
            name: 'jobs-create',
            url: '/jobs/create',
            templateUrl: 'js/jobs/wizard/wizard.html',
        });
}])

.constant('componentsSettings', {
        transl8Uri: "https://arachne.dainst.org/transl8/translation/jsonp?application=shared&lang={LANG}"
    }
)

.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        let filtered = [];
        angular.forEach(items, function(item, id) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) {
            filtered.reverse();
        }

        return filtered;
    };
});
