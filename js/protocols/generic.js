angular
.module("module.protocols.generic", [])
.factory("generic", ['$rootScope', 'editables', 'protocolregistry', 'documentsource', 'journal',
	function($rootScope, editables, protocolregistry, documentsource, journal) {

	var journalCtrl = new protocolregistry.Protocol('generic');

	journalCtrl.description = "Generic Import protocol";

	journalCtrl.init = function() {
		// get document(s)
		documentsource.getDocuments(journal.data.importFilePath);
	}




	return (journalCtrl);
}])
.run(function(generic) {generic.register()})
