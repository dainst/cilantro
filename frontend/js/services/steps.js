/* step control */

angular
.module('module.steps', [])
.factory("steps", ['fileManager', 'dataset', 'messenger', 'webservice', function(fileManager, dataset, messenger, webservice) {

    const cacheKiller = '?nd=' + Date.now();

    let steps = {
        current : "start",
        isStarted: false
    };

    steps.views = {
        "start": {
            "template": "partials/views/start_page.html",
            "title": "Start",
            "showIf": function() {return false}
        },
        "home": {
            "template": "partials/views/home.html",
            "title": "Home",
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
            "showIf": function () {
                return webservice.isLoggedIn()
            }
        }
    };

    let tabs = {
        current: "messages",
        isCollapsed: false
    };

    steps.tabs = {
        "data": {
            "template": "partials/elements/sidebar_data.html",
            "title": "My Data",
            "showIf": function() {return steps.isStarted && steps.current !== "fatal" && tabs.current !== "data"}
        },
        "help": {
            "template": "partials/elements/sidebar_help.html",
            "title": "Help",
            "showIf": function() {return steps.isStarted && steps.current !== "fatal"  && tabs.current !== "help"}
        },
        "messages": {
            "template": "partials/elements/sidebar_messages.html",
            "title": "Messages",
            "showIf": function() {return steps.isStarted && steps.current !== "fatal"  && tabs.current !== "messages"}
        }
    };

    steps.getCurrent = (tab) => {
        return (tabs.current === tab);
    };

    steps.changeView = function(to) {

        if (typeof steps.views[to] === "undefined") {
            console.warn('view ' + to + ' does not exist');
            return;
        }

        if (to === steps.current) {
            return;
        }

        console.log('Tab changeView to: ', to);
        //$scope.message.reset();
        steps.current = to;

    };

    steps.getTemplate = function() {
        if (webservice.userData.username === null && webservice.userData.password === null)
            steps.current = "start";
        if (angular.isUndefined(steps.views[steps.current]) || angular.isUndefined(steps.views[steps.current].template)) {
            messenger.error("View '" + steps.current + "' not found.");
            steps.current = "fatal";
        }
        return steps.views[steps.current].template + cacheKiller;
    };

    steps.changeTab = (to) => {
        if (to === tabs.current) {
            return;
        }
        if(tabs.isCollapsed){
            tabs.isCollapsed = false;
        }
        tabs.current = to;
    };

    steps.getTab = () => {
        return steps.tabs[tabs.current].template + cacheKiller;
    };

    steps.collapseTabs = () => {
        tabs.current = "collapsed";
        tabs.isCollapsed = true;
    };

    steps.isCollapsed = () => {
        return tabs.isCollapsed;
    };

    steps.getStatus = () => {
        return steps.isStarted;
    };

    return (steps);
}]);
