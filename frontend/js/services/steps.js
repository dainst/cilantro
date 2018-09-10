/* step control */

angular
.module('module.steps', [])
.factory("steps", ['fileManager', 'dataset', 'messenger', function(fileManager, dataset, messenger) {

    const cacheKiller = '?nd=' + Date.now();

    let steps = {
        current : "home",
        isStarted: false
    };

    steps.views = {
        "home": {
            "template": "partials/views/home.html",
            "title": "Start",
            "showIf": function() {return !steps.isStarted && steps.current != "fatal"}
        },
        "restart": {
            "template": "partials/views/restart.html",
            "title": "Restart",
            "showIf": function() {return steps.isStarted || steps.current == "fatal"}
        },
        "documents": {
            "template": "partials/views/documents.html",
            "title": "Documents",
            "showIf": function() {return steps.isStarted}
        },
        "overview": {
            "template": "partials/views/overview.html",
            "title": "Overview",
            "showIf": function() {return steps.isStarted}
        },
        "articles": {
            "template": "partials/views/subobjects.html",
            "title": "Articles",
            "showIf": function() {return steps.isStarted}
        },
        "publish": {
            "template": "partials/views/finish.html",
            "title": "Publish",
            "showIf": function() {return steps.isStarted && fileManager.ready && dataset.isReadyToUpload()}
        },
        "fatal": {
            "template": "partials/views/fatal.html",
            "title": "Fatal Error",
            "showIf": function() {return false}
        },
        "jobs": {
            "template": "partials/views/jobs.html",
            "title": "Jobs",
            "showIf": function() {return steps.isStarted}
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
