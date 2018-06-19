/* step control */

angular
.module('module.steps', [])
.factory("steps", ['documentsource', 'journal', function(documentsource, journal) {
	

	let steps = {
		list: {
			"home": 	{
				"template": "partials/view_home.html",
				"title": "Start",
				"condition": function() {return !(steps.isStarted)}
			},
			"restart": 	{
				"template": "partials/view_restart.html",
				"title": "Restart",
				"condition": function() {return steps.isStarted}
			},
			"documents": {
				"template": "partials/view_documents.html",
				"title": "Documents",
				"condition": function() {return documentsource.ready}
			},
			"overview": {
				"template": "partials/view_overview.html",
				"title": "Overview",
				"condition": function() {return documentsource.ready}
			},
			"articles": {
				"template": "partials/view_articles.html",
				"title": "Articles",
				"condition": function() {return documentsource.ready}
			},
			"publish": 	{
				"template": "partials/view_finish.html",
				"title": "Publish",
				"condition": function() {return steps.isStarted && documentsource.ready && journal.isReadyToUpload()}
			},
            "fatal": {
                "template": "partials/view_fatal.html",
                "title": "Fatal Error",
                "condition": function() {return false}
            }

			},
		isStarted : false,
		current : "home" };


	steps.change = function(to) {

			if (typeof steps.list[to] === "undefined") {
				console.warn('view ' + to + ' does not exist');
				return;
			}

			if (to === steps.current) {
				return;
			}

			console.log('Tab change to: ', to);
			//$scope.message.reset();
			steps.current = to;
		}
	
	return (steps);
}])
