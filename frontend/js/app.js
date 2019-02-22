'use strict';

angular

.module('pimport', [

    'ui.bootstrap',
    'ngFileUpload',
    'ui.router',

    'idai.components',
    'idai.templates',

    'module.labels',
    'module.pdfFileManager',
    'module.dataset',
    'module.fileManager',
    'module.messenger',
    'module.webservice',
    'module.cookiemanager',
    'module.stagingDir',
    'module.steps',
    'module.journalIssue',
    'module.zenonImporter',
    'module.languageStrings',
    'module.editables',
    'module.settings',
    'module.jobs',

    'controller.main',

    'controller.wizardController',
    'controller.viewStart',
    'controller.viewOverview',
    'controller.viewSubObjects',
    'controller.viewFinish',
    'controller.viewDocuments',
    'controller.viewJobs',
    'controller.login',

    'controller.csvImportWindow',
    'controller.upload',
    'directive.editable',
    'directive.multiselect',
    'directive.salviaNavbar',
    'directive.messagebox',
    'directive.filesTreeview',
    'directive.stats',
    'directive.zenon',
    'directive.autoheight',
    'directive.mainObject',
    'directive.job',

    'module.fileHandlers.defaultPdfHandler',
    'module.fileHandlers.emptyPdfHandler',
    'module.fileHandlers.chironParted',
    'module.fileHandlers.csvImport',
])

.config(['$urlRouterProvider', function($urlRouterProvider){
    $urlRouterProvider.when('', '/');
}])

.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state({
            name: 'home',
            url: '/',
            templateUrl: 'js/home.html'
        })
        .state({
            name: 'jobs-list',
            url: '/jobs',
            templateUrl: 'js/jobs/jobs.html',
        })
        .state( {
            name: 'jobs-create',
            url: '/jobs/create',
            templateUrl: 'js/jobs/wizard/wizard.html',
        });
}])

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
