/* step control */

angular
.module('module.steps', [])
.factory("steps", ['documentsource', 'journal', 'messenger', function(documentsource, journal, messenger) {

    const cacheKiller = '?nd=' + Date.now();

    let steps = {
        current : "home",
        isStarted: false
    };

    steps.views = {
        "home": {
            "template": "partials/view_home.html",
            "title": "Start",
            "showIf": function() {return !steps.isStarted}
        },
        "restart": {
            "template": "partials/view_restart.html",
            "title": "Restart",
            "showIf": function() {return steps.isStarted}
        },
        "documents": {
            "template": "partials/view_documents.html",
            "title": "Documents",
            "showIf": function() {return documentsource.ready}
        },
        "overview": {
            "template": "partials/view_overview.html",
            "title": "Overview",
            "showIf": function() {return documentsource.ready}
        },
        "articles": {
            "template": "partials/view_articles.html",
            "title": "Articles",
            "showIf": function() {return documentsource.ready}
        },
        "publish": {
            "template": "partials/view_finish.html",
            "title": "Publish",
            "showIf": function() {return steps.isStarted && documentsource.ready && journal.isReadyToUpload()}
        },
        "fatal": {
            "template": "partials/view_fatal.html",
            "title": "Fatal Error",
            "showIf": function() {return false}
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
