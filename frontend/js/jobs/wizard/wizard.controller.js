
angular.module('controller.wizardController', [])

.controller('wizardController', ['$scope', '$uibModal', 'webservice', 'settings', 'messenger', 'fileManager', 'dataset', 'stagingDir', 'steps',
    function ($scope, $uibModal, webservice, settings, messenger, fileManager, dataset, stagingDir, steps) {

    $scope.steps = steps;

    $scope.isLoading = true;

    $scope.failFatal = err => {
        console.error("Fatal Error", err);
        $scope.isLoading = false;
        steps.changeView("fatal");
        $scope.refreshView();
    };

    $scope.initApp = () => {
        dataset.reset();
        $scope.isLoading = false;
    };

    $scope.start = () => {
        dataset.reset();
        $scope.isLoading = true;
        steps.isStarted = false;
        return settings.load.then(() => {
            webservice.get(["ojs_url", 'journalInfo'])
                .then((journalInfo) => {
                    console.log("journalInfo", journalInfo);
                    dataset.setConstraints(journalInfo.data);
                    webservice.get('staging')
                        .then((stagingFolder) => {
                            console.log("stagingFolder", stagingFolder);
                            stagingDir.update(stagingFolder);
                            $scope.isLoading = false;
                            fileManager.reset();
                            fileManager.selectDefaultFileHandlers();

                            $scope.refreshView();

                        })
                        .catch($scope.failFatal);
                })
                .catch($scope.failFatal);
            })
            .catch($scope.failFatal)
    };

    /* restart */
    $scope.restart = ()  => {
        $scope.start().then(() => {
            messenger.clear();
            messenger.info('Restart Importer');
            steps.changeView('home');
        });
    };

    $scope.refreshView = () => {
        if(!$scope.$$phase){
            $scope.$apply();
        }
    };

    $scope.start();

}]);
