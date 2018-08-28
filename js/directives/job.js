'use strict';

angular

    .module('directive.job', [])

    .directive('job', [function() {
        return {
            restrict: 'E',
            templateUrl: 'partials/elements/job.html',
            scope: {
                job: '=',
            },
            link: function(scope, element, attrs) {

            }
        }
    }]);