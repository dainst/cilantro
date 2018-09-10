'use strict';

angular

    .module('directive.filesTreeview', [])

    .directive('filesTreeview', ['fileManager', function(fileManager) {
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
                scope.handleFile = fileManager.handleFile;
                scope.getClass = file => {
                    if (fileManager.getFileStatus(file) === true) return 'loaded';
                    if (fileManager.getFileStatus(file) === false) return 'error';
                    return "";
                };
                scope.ssss = fileManager.getFileStatus;
            }
        }
    }]);