angular
.module('directive.salviaNavbar', ['ng'] )
.directive('salviaNavbar' , ['steps', 'settings', function(steps, settings) {
    return {
        restrict: 'E',
        templateUrl: 'partials/elements/salvia_navbar.html',
        link: function(scope, elem, attrs) {
            scope.settings = settings;
            scope.views = steps.views;
            scope.changeView = steps.change;
            scope.getCurrentView = () => steps.current;
        }
    }
}]);
