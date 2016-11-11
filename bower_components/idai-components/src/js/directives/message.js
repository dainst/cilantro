'use strict';

angular.module('idai.components')


/**
 * @author: Daniel M. de Oliveira
 */

.directive('idaiMessage', function() {
    return {
        restrict: 'E',
        templateUrl: 'partials/directives/idai-message.html',
        controller: [ '$scope', 'message',
            function($scope,message) {

                $scope.messages = message.getMessages();

                $scope.removeMessage = function(transl8Key){
                    message.removeMessage(transl8Key)
                };

            }]
    }});