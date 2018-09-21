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

    let tabs = {
        current: "data",
        isCollapsed: false
    }

    steps.sidebar = {
        "data": {
            "template": "partials/elements/sidebar_data.html",
            "title": "My Data",
            "showIf": function() {return steps.isStarted && steps.current != "fatal"}
        },
        "help": {
            "template": "partials/elements/sidebar_help.html",
            "title": "Help",
            "showIf": function() {return steps.isStarted && steps.current != "fatal"}
        },
        "messages": {
            "template": "partials/elements/sidebar_messages.html",
            "title": "Messages",
            "showIf": function() {return steps.isStarted && steps.current != "fatal"}
        }
    };

    steps.getCurrent = (tab) => {
        return (tabs.current === tab);
    }

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

        tabs.current = to;
    }

    steps.getTab = () => {
        return steps.sidebar[tabs.current].template;
    }

    steps.toggleTab = () => {
        let sidebar = document.getElementById('main-sidebar');
        let container = document.getElementById('main-container');
        let toggle =  document.getElementById('toggleButton')

        if(tabs.isCollapsed){
            sidebar.style.width = "calc(20% - 40px)";
            sidebar.style.padding = "15px 20px 10px 20px";
            container.style.width = "80%";
            toggle.class = "glyphicon glyphicon-remove-circle"
        }
        else {
            sidebar.style.width = "0%";
            sidebar.style.padding = "15px 0px 10px 0px";
            container.style.width = "calc(100% - 40px)";
            toggle.class = "glyphicon glyphicon-chevron-left";
        }
        tabs.isCollapsed = !tabs.isCollapsed;
    }

    steps.getTabStatus = () => {
        return tabs.isCollapsed;
    }

    return (steps);
}]);
