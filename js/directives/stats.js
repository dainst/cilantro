angular
.module('directive.stats', ['ng'] )
.directive('stats', ['dataset', 'file_manager', function(dataset, file_manager) {
    return {
        restrict: 'E',
        scope: {
            type: "="
        },
        templateUrl: 'partials/elements/stats.html',
        link: function(scope, elem, attrs) {

            scope.type = attrs.type;

            const getObject = () => (attrs.type === "subobjects") ? dataset : file_manager;

            scope.getStats = () => getObject().getStats();

            scope.isStatOk = (stat, value) => getObject().isStatOk(stat, value);

            scope.getStatLabel = (stat) => stat[0].toUpperCase() + stat.substr(1);

        }
    }
}]);