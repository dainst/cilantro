'use strict';

angular.module('sampleApp',[
	'ui.bootstrap',
	'ngRoute',
	'ngAnimate',
	'idai.components',
	'idai.templates',
	'sampleApp.controllers'
])
.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$locationProvider.html5Mode(true);
		$routeProvider
			.when('/', {templateUrl: 'partials/home.html'})
			.when('/info/layout', {templateUrl: 'partials/layout.html'})
			.when('/info/i18n', {templateUrl: 'partials/i18n.html'})
			.when('/info/forms', {templateUrl: 'partials/forms.html'})
			.when('/info/header', {templateUrl: 'partials/header.html'});
	}
]).constant('componentsSettings', {
		transl8Uri: "http://bogusman01.dai-cloud.uni-koeln.de/transl8/translation/jsonp?application=arachne4_frontend&lang={LANG}&callback=JSON_CALLBACK"
	}
);