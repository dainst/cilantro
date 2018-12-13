'use strict';

angular

.module('controller.main', [])

    .controller('main', ['$scope', '$uibModal', 'webservice', '$location',
        function ($scope, $uibModal, webservice, $location) {

        $scope.openLoginModal = function () {
            const modalInstance = $uibModal.open({
                templateUrl: 'js/modals/login.html',
                controller: 'login'
            });
            modalInstance.result.then(function (user) {
                $scope.user = user;
                $location.path('/');
            });
        };

        $scope.logout = function () {
            webservice.logUserOut();
            $scope.user = webservice.userData;
            $location.path('/');
        };

        $scope.refreshView = () => {
            if(!$scope.$$phase){
                $scope.$apply();
            }
        };

		$scope.$on('refreshView', $scope.refreshView);
		window.refresh = $scope.refreshView;
	}
]);
