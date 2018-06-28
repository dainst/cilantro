angular
.module('directive.stats', ['ng'] )
.directive('stats', ['dataset', function(dataset) {
    return {
        restrict: 'E',
        scope: {
            type: "="
        },
        templateUrl: 'partials/elements/stats.html',
        link: function(scope, elem, attrs) {
            scope.getStats = dataset.getStats;
            scope._isOk = function(k) {
                if (k === 'undecided') {
                    return 0;
                } else if (k === 'confirmed') {
                    return 1;
                } else if (k === 'dismissed') {
                    return -1;
                }
            };
        }
    }
}]);