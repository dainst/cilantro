angular
.module("module.protocols.generic", [])
.factory("generic", ['editables', 'protocolregistry', function(editables, protocolregistry) {

	var journalCtrl = new protocolregistry.Protocol('generic');

	journalCtrl.description = "Generic Import protocol";


	return (journalCtrl);
}])
.run(function(generic) {generic.register()})
