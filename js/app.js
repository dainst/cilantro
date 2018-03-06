'use strict';

angular

.module('pimport', [

	'ui.bootstrap',
	'ngFileUpload',

	'idai.components',
	'idai.templates',

	'module.documentsource',
	'module.journal',
	'module.protocolregistry',
	'module.infobox',
	'module.messenger',
	'module.webservice',

	'controller.main',

	'controller.view_overview',
	'controller.view_articles',
	'controller.view_finish',

	'controller.upload',
	'directive.editable',
	'directive.multiselect',
	'module.editables',

	'module.settings',

	'module.protocols.testdata',
	'module.protocols.generic',
	'module.protocols.chiron_parted',
	'module.protocols.csv_import'


])
/*
.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
	}
])
*/
.constant('componentsSettings', {
		transl8Uri: "https://arachne.dainst.org/transl8/translation/jsonp?application=shared&lang={LANG}"
	}
)

.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item, id) {
			filtered.push(item);
		});
		filtered.sort(function (a, b) {
			return (a[field] > b[field] ? 1 : -1);
		});
		if(reverse) {
			filtered.reverse();
		}
		
		return filtered;
	};
});
