'use strict';

angular

.module('pimport', [
	'ui.bootstrap',
/*	'ngRoute',*/
/*	'ngAnimate',
	'ngResource',*/
	'idai.components',
	'idai.templates',
	'controller.main',
	'controller.pdf',
	'controller.nopdf',
	'directive.editable',
	'module.editables',
	'module.pimportws',
	'module.journalmaster',
	'module.settings',
	
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