'use strict';

angular

    .module('directive.editable', [])

    .directive('editable', [function() {

        const killCache = '?nd=' + Date.now();

        return {
          template: '<ng-include src="getTemplateUrl()" />',
          restrict: 'A',
          scope: {
            item: '='
          },
          link: function(scope, elem, attrs) {
              scope.id = 'ID#' + Math.random();
              scope.caption = attrs.caption;
              scope.getTemplateUrl = () =>
                  (angular.isUndefined(scope.item) || angular.isUndefined(scope.item.type) || scope.item.readonly)
                      ? 'partials/editables/undefined.html' + killCache
                      : 'partials/editables/' + scope.item.type + '.html'  + killCache;
          }
        }
      }
    ]);