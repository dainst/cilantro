angular.module('workbench.jobs', [])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state({
                name: 'jobs',
                url: '/jobs',
                templateUrl: 'js/jobs/jobs.html',
            })
            .state({
                name: 'jobs.list',
                url: '/list',
                templateUrl: 'js/jobs/list.html',
            });
    }]);
