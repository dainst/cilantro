'use strict';

angular

.module('pimport', [

	'ui.bootstrap',
	'ngFileUpload',

	'idai.components',
	'idai.templates',

    'module.labels',
	'module.pdf_file_manager',
	'module.dataset',
	'module.file_handler_manager',
	'module.messenger',
	'module.webservice',
	'module.staging_dir',
	'module.steps',
    'module.journal_issue',


	'controller.main',

	'controller.view_overview',
	'controller.view_articles',
	'controller.view_finish',
	'controller.view_documents',

	'controller.upload',
	'directive.editable',
	'directive.multiselect',
    'directive.salviaNavbar',
    'directive.messagebox',
    'directive.filesTreeview',
    'directive.stats',

	'module.editables',

	'module.fileHandlers.testdata',
	'module.fileHandlers.generic',
	'module.fileHandlers.chiron_parted',
	'module.fileHandlers.csv_import',

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
