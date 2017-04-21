'use strict';

angular

.module('pimport', [
	'ui.bootstrap',
	'ngFileUpload',
/*	'ngRoute',*/
/*	'ngAnimate',
	'ngResource',*/
	'idai.components',
	'idai.templates',

	'controller.message',
	'module.messenger',

	'controller.main',

	'controller.view_overview',
	'controller.view_articles',
	'controller.view_finish',


	'controller.pdf',
	'controller.nopdf',
	'module.folder',
	'controller.upload',
	'directive.editable',
	'directive.multiselect',
	'module.editables',
	'module.pimportws',
	'module.settings',
	
	'module.chiron_parted',
	'module.chiron',
	'module.generic',
	'module.testdata'
])
/*
.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
	}
])
*/
.constant('componentsSettings', {
		transl8Uri: "https://arachne.dainst.org/transl8/translation/jsonp?application=shared&lang={LANG}&callback=JSON_CALLBACK"
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
