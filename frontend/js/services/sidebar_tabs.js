/* step control */

angular
    .module('module.sidebar_tabs', [])
    .factory("sidebar_tabs", ['fileManager', 'dataset', 'messenger', function(fileManager, dataset, messenger) {

        const cacheKiller = '?nd=' + Date.now();

        let steps = {
            current : "dummy",
            isStarted: false
        };

        steps.views = {
            "dummy": {
                "template": "partials/elements/dummy.html",
                "title": "Dummy",
                "showIf": function() {return !steps.isStarted}
            }
        };

        steps.change = function(to) {

            if (typeof steps.views[to] === "undefined") {
                console.warn('view ' + to + ' does not exist');
                return;
            }

            if (to === steps.current) {
                return;
            }

            console.log('Tab change to: ', to);
            //$scope.message.reset();
            steps.current = to;

        };

        steps.getTemplate = function() {
            if (angular.isUndefined(steps.views[steps.current]) || angular.isUndefined(steps.views[steps.current].template)) {
                messenger.error("View '" + steps.current + "' not found.");
                steps.current = "fatal";
            }
            return steps.views[steps.current].template + cacheKiller;
        };


        return (steps);
    }]);
