/**
 * Created by pfranck on 20.04.17.
 */

angular

.module('controller.message', [])

.controller('message', ['$scope', '$log', '$rootScope', 'messenger',
	function($scope, $log, $rootScope, messenger) {

		$scope.message = messenger.content;

		$scope.infoBoxOpen = false;
		$scope.toggleInfoBox = function(to) {
			$scope.infoBoxOpen = to || !$scope.infoBoxOpen;
		}

		$scope.hasContent = function() {
			return (messenger.content.warnings.length > 0) ||
				(messenger.content.debug.length > 0) ||
				(messenger.content.message) ||
				(Object.keys(messenger.content.stats).length > 0)
		}


	}
])