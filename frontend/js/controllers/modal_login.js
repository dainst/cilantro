angular

    .module('controller.login', ['ui.bootstrap'])

    .controller('login', ['$scope', '$uibModalInstance', 'webservice', '$timeout',
        function ($scope, $uibModalInstance, webservice, $timeout) {

            $scope.loginData = {};
            $scope.loginerror = false;

            $scope.login = function () {
                if ($scope.loginData.username) {
                    webservice.userData = $scope.loginData;
                    webservice.authenticateUser($scope.loginData)
                        .then(res => {
                            $uibModalInstance.close($scope.loginData);
                        })
                        .catch(err => {
                            $scope.loginerror = true;
                            $scope.refreshView();
                        });

                } else {
                    $scope.loginerror = true;
                }


            };
            $scope.refreshView = () => {
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            };
            $scope.inputChange = function () {
                $scope.loginerror = false;
            };

            $scope.cancel = function () {
                $uibModalInstance.dismiss();
            };
        }]);
