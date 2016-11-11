'use strict';

angular.module('idai.components')

    /**
     * @author: Jan G. Wieners
     */
    .directive('idaiHeader', function () {
        return {
            restrict: 'E',
            //replace: 'true',
            scope: {
                image: '@',
                description: '@',
                link: '@'
            },
            templateUrl: 'partials/directives/idai-header.html'
        }
    });