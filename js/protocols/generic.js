angular
.module("module.protocols.generic", [])
.factory("generic", ['editables', 'protocolregistry', function(editables, protocolregistry) {

	var journalCtrl = new protocolregistry.Protocol('generic');

	journalCtrl.description = "Generic Import protocol";


	/* the journal's settings */

	journalCtrl.columns = ['title'];

	journalCtrl.init = function() {
		console.log('init protocol');
		journalCtrl.main.steps.change('overview');
	};

	return (journalCtrl);
}])
.run(function(generic) {generic.register()})
