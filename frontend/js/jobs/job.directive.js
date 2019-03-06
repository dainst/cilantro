angular.module('workbench.jobs')

    .directive('job', ['jobs', function(jobs) {
        return {
            restrict: 'E',
            templateUrl: 'js/jobs/job.html',
            scope: {
                job: '=',
            },
            link: function(scope, element, attrs) {
                scope.tasks = jobs.tasks;
            }
        }
    }]);
