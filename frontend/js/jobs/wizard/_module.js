angular.module('workbench.jobs.wizard', [
        'ngFileUpload',
        'workbench.files',
        'workbench.zenon'
    ])

    .config(['$stateProvider', function($stateProvider) {
        $stateProvider
            .state( {
                name: 'jobs.create',
                url: '/create',
                templateUrl: 'js/jobs/wizard/wizard.html',
            });
    }]);
