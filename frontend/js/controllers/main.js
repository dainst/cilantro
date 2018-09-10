'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', 'webservice', 'settings', 'messenger', 'fileManager', 'dataset', 'stagingDir', 'steps',
	function ($scope, webservice, settings, messenger, fileManager, dataset, stagingDir, steps) {

		$scope.cacheKiller = '?nd=' + Date.now();

        $scope.steps = steps;

        $scope.isLoading = true;

        $scope.failFatal = err => {
            console.error("fatal error", err);
            $scope.isLoading = false;
            steps.change("fatal");
            $scope.refreshView();
        };

		$scope.initApp = function() {

            $scope.isLoading = true;
            steps.isStarted = false;
            dataset.reset();

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
			$scope.initApp().then(() => {
			    messenger.clear();
                messenger.info('Restart Importer');
                steps.change('home');
            });
		};

		$scope.refreshView = () => {
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        };

		$scope.$on('refreshView', $scope.refreshView);
		window.refresh = $scope.refreshView;
	}
]);
