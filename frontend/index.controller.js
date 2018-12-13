'use strict';

angular

.module('controller.main', [])

    .controller('main', ['$scope', '$uibModal', 'webservice', '$route',
        function ($scope, $uibModal, webservice, $route) {

        $scope.openLoginModal = function () {
            const modalInstance = $uibModal.open({
                templateUrl: 'js/modals/login.html',
                controller: 'login'
            });
            modalInstance.result.then(function (user) {
                $scope.user = user;
                $route.reload();
            });
        };

        $scope.logout = function () {
            webservice.logUserOut();
            $scope.user = webservice.userData;
            $route.reload();
        };

		$scope.$on('refreshView', $scope.refreshView);
		window.refresh = $scope.refreshView;
	}
]);
