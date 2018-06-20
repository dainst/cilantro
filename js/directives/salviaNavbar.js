angular
.module('directive.salviaNavbar', ['ng'] )
.directive('salviaNavbar' , ['steps', 'settings', function(steps, settings) {
    return {
        restrict: 'E',
        templateUrl: 'partials/elements/salviaNavbar.html',
        link: function(scope, elem, attrs) {
            scope.settings = settings;
            scope.views = steps.views;
            scope.changeView = steps.change;
            scope.currentView = steps.current;
        }
    }
}]);
