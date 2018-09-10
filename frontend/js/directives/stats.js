angular
.module('directive.stats', ['ng'] )
.directive('stats', ['dataset', 'fileManager', function(dataset, fileManager) {
    return {
        restrict: 'E',
        scope: {
            type: "="
        },
        templateUrl: 'partials/elements/stats.html',
        link: function(scope, elem, attrs) {

            scope.type = attrs.type;

            const getObject = () => (attrs.type === "subobjects") ? dataset : fileManager;

            scope.getStats = () => getObject().getStats();

            scope.isStatOk = (stat, value) => getObject().isStatOk(stat, value);

            scope.getStatLabel = (stat) => stat[0].toUpperCase() + stat.substr(1);

        }
    }
}]);