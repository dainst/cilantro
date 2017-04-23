angular
.module('module.protocols', [])
.factory("generic", ['$log', 'editables', function($log, editables) {

	var journalCtrl = function() {
		var main = {}
	};

	/* the journal's settings */
	journalCtrl.id = 'generic';
	journalCtrl.columns = ['title'];



	journalCtrl.init = function() {
		$log.log('init protocol');
		// load next page
		journalCtrl.main.steps.change('overview');
	};


	return (journalCtrl);
}]);
