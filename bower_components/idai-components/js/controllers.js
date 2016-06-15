'use strict';

/* Controllers */

angular.module('sampleApp.controllers',[])

.controller('MainController',	[ '$scope', 'message',
	function ($scope, message) {

		$scope.user = {username:"daniel"};

        $scope.addMsg = function(transl8Key, level, showContactInfo) {
            message.addMessageForCode(transl8Key, level, showContactInfo);
        }

	}
]);