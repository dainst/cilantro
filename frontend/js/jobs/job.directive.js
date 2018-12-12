'use strict';

angular

    .module('directive.job', [])

    .directive('job', ['jobs', function(jobs) {
        return {
            restrict: 'E',
            templateUrl: 'js/directives/job.html',
            scope: {
                job: '=',
            },
            link: function(scope, element, attrs) {
                scope.tasks = jobs.tasks;
            }
        }
    }]);