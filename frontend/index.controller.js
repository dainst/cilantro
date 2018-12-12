'use strict';

angular

.module('controller.main', [])

    .controller('main', ['$scope', '$uibModal', 'webservice', 'settings', 'messenger', 'fileManager', 'dataset', 'stagingDir', 'steps',
        function ($scope, $uibModal, webservice, settings, messenger, fileManager, dataset, stagingDir, steps) {

        $scope.openLoginModal = function () {
            const modalInstance = $uibModal.open({
                templateUrl: 'js/modals/login.html',
                controller: 'login'
            });
            modalInstance.result.then(function (user) {
                $scope.user = user;
                $scope.restart();
            });
        };

        $scope.logout = function () {
            webservice.logUserOut();
            $scope.user = webservice.userData;
            $scope.restart();
        };

		$scope.$on('refreshView', $scope.refreshView);
		window.refresh = $scope.refreshView;
	}
]);
