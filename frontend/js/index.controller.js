angular.module('workbench')

    .controller('indexController', ['$scope', '$uibModal', 'webservice', '$location', 'cookiemanager',
        function ($scope, $uibModal, webservice, $location, cookiemanager) {

            $scope.openLoginModal = function () {
                const modalInstance = $uibModal.open({
                    templateUrl: 'js/modals/login.html',
                    controller: 'login'
                });
                modalInstance.result.then(function (user) {
                    webservice.setUserData(user.username, user.password);
                    $scope.user = webservice.userData;
                    cookiemanager.setCookie('user', webservice.userData);
                    $location.path('/');
                });
            };

            $scope.logout = function () {
                cookiemanager.deleteCookie('user');
                webservice.logUserOut();
                $scope.user = webservice.userData;
                $location.path('/');
            };

            $scope.refreshView = () => {

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };

            $scope.$on('refreshView', $scope.refreshView);
            window.refresh = $scope.refreshView;


            let userData = cookiemanager.getCookie('user');
            if (userData) {

                $scope.user = userData;
                webservice.userData = userData;
            }
        }
    ]);
