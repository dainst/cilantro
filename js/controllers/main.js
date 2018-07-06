'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', 'webservice', 'settings', 'messenger', 'file_manager', 'dataset', 'staging_dir', 'steps',
	function ($scope, webservice, settings, messenger, file_manager, dataset, staging_dir, steps) {

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
                                staging_dir.update(stagingFolder);
                                $scope.isLoading = false;
                                file_manager.reset();
                                file_manager.selectDefaultFileHandlers();

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
	}
]);
