/*
 * contains the journal-import-ptotocol specific stuff
 * 
 * 
 */
angular
.module('module.journalmaster', [])
.factory("journalmaster", ['$log', '$injector', function($log, $injector) {
	var journalmaster = {};
	journalmaster.name = '';
	journalmaster.control = {};
	journalmaster.set = function(chosen) {
		journalmaster.name  = chosen;
		journalmaster.control = $injector.get(chosen);
		return journalmaster.control;
	}
	return journalmaster;
}]);