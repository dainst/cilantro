angular
    .module('directive.mainObject', ['ng'] )
    .directive('mainObject' , ['dataset', 'labels', function(dataset, labels) {
        return {
            restrict: 'E',
            templateUrl: 'partials/elements/main_object.html',
            scope: {},
            link: function (scope, element, attrs) {
                scope.dataset = dataset;
                scope.labels = labels;
            }
        }
    }]);