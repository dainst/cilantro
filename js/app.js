'use strict';

angular

.module('pimport', [

	'ui.bootstrap',
	'ngFileUpload',

	'idai.components',
	'idai.templates',

    'module.labels',
	'module.documentsource',
	'module.dataset',
	'module.protocolregistry',
	'module.messenger',
	'module.webservice',
	'module.repository',
	'module.steps',
    'module.journal_issue',


	'controller.main',

	'controller.view_overview',
	'controller.view_articles',
	'controller.view_finish',

	'controller.upload',
	'directive.editable',
	'directive.multiselect',
    'directive.salviaNavbar',
    'directive.messagebox',
    'directive.stats',

	'module.editables',

	'module.protocols.testdata',
	'module.protocols.generic',
	'module.protocols.chiron_parted',
	'module.protocols.csv_import',

    'module.settings'

])

.constant('componentsSettings', {
		transl8Uri: "https://arachne.dainst.org/transl8/translation/jsonp?application=shared&lang={LANG}"
	}
)

.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		let filtered = [];
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
