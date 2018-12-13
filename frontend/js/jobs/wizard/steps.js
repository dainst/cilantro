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
            "template": "js/jobs/wizard/start.html",
            "title": "Start",
            "showIf": () => false
        },
        "restart": {
            "template": "js/jobs/wizard/restart.html",
            "title": "Restart",
            "showIf": function() {return steps.isStarted || steps.current === "fatal"}
        },
        "documents": {
            "template": "js/jobs/wizard/documents.html",
            "title": "Documents",
            "showIf": function() {return steps.isStarted}
        },
        "overview": {
            "template": "js/jobs/wizard/overview.html",
            "title": "Overview",
            "showIf": function() {return steps.isStarted}
        },
        "articles": {
            "template": "js/jobs/wizard/subobjects.html",
            "title": "Articles",
            "showIf": function() {return steps.isStarted}
        },
        "publish": {
            "template": "js/jobs/wizard/finish.html",
            "title": "Publish",
            "showIf": function() {return steps.isStarted && fileManager.ready && dataset.isReadyToUpload()}
        },
        "fatal": {
            "template": "js/fatal.html",
            "title": "Fatal Error",
            "showIf": function() {return false}
        }
    };

    let tabs = {
        current: "messages",
        isCollapsed: false
    };

    steps.tabs = {
        "data": {
            "template": "js/jobs/sidebar_data.html",
            "title": "My Data",
            "showIf": function() {return steps.isStarted && steps.current !== "fatal" && tabs.current !== "data"}
        },
        "help": {
            "template": "js/jobs/sidebar_help.html",
            "title": "Help",
            "showIf": function() {return steps.isStarted && steps.current !== "fatal"  && tabs.current !== "help"}
        },
        "messages": {
            "template": "js/jobs/sidebar_messages.html",
            "title": "Messages",
            "showIf": function() {return steps.isStarted && steps.current !== "fatal"  && tabs.current !== "messages"}
        },
        "collapsed": {
            "template": "js/jobs/sidebar_collapsed.html",
        }
    };

    steps.getCurrent = (tab) => {
        return (tabs.current === tab);
    };

    steps.changeView = (to) => {

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
        console.log()
    };

    steps.getTemplate = () => {
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

    steps.getTab = () =>
        steps.tabs[tabs.current].template + cacheKiller;

    steps.collapseTabs = () => {
        tabs.current = "collapsed";
        tabs.isCollapsed = true;
    };

    steps.isCollapsed = () =>
        tabs.isCollapsed;

    steps.getStatus = () =>
        steps.isStarted;

    steps.reset = () => {
        steps.current = 'start';
        steps.isStarted = false;
    }

    return (steps);
}]);
