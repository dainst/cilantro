'use strict';

angular

    .module('directive.filesTreeview', [])

    .directive('filesTreeview', ['file_manager', function(file_manager) {
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
                scope.handleFile = file_manager.handleFile;
                scope.getClass = file => {
                    if (file_manager.getFileStatus(file) === true) return 'loaded';
                    if (file_manager.getFileStatus(file) === false) return 'error';
                    return "";
                };
                scope.ssss = file_manager.getFileStatus;
            }
        }
    }]);