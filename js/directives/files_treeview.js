'use strict';

angular

    .module('directive.filesTreeview', [])

    .directive('filesTreeview', ['file_handler_manager', function(file_handler_manager) {
        return {
            restrict: 'E',
            templateUrl: 'partials/elements/files_treeview.html',
            scope: {
                tree: '=',
                filehandler: '=',

            },
            link: function(scope, element, attrs) {
                const openStates = {};
                scope.isOpen = path => angular.isDefined(openStates[path]) && openStates[path];
                scope.toggle = path => openStates[path] = !openStates[path];
                scope.loadFile = file_handler_manager.loadFile;
                scope.loadDir = file_handler_manager.loadDir;
                scope.isLoaded = file_handler_manager.isFileLoaded;
            }
        }
    }]);