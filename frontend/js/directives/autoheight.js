'use strict';

angular
    .module('directive.autoheight', [])
    .directive('autoheight', ['$timeout',
        function($timeout) {
            return {
                restrict: 'A',
                link: function($scope, element) {
                    $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                    const resize = () => {
                        element[0].style.height = $scope.initialHeight;
                        element[0].style.height = "" + element[0].scrollHeight + "px";
                    };
                    element.on("input change", resize);
                    $timeout(resize, 0);
                }
            };
        }
    ]);

// @see blockloop @ https://stackoverflow.com/questions/17772260/textarea-auto-height