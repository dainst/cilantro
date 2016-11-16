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
	'controller.main',
	'controller.pdf',
	'controller.nopdf',
	'controller.folder',
	'controller.upload',
	'directive.editable',
	'module.editables',
	'module.pimportws',
	'module.journalmaster',
	'module.settings',
	
	'module.chiron_parted',
	'module.chiron',
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
		transl8Uri: "http://bogusman01.dai-cloud.uni-koeln.de/transl8/translation/jsonp?application=arachne4_frontend&lang={LANG}&callback=JSON_CALLBACK"
	}
)

.filter('orderObjectBy', function() {
	return function(items, field, reverse) {
		var filtered = [];
		angular.forEach(items, function(item) {
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