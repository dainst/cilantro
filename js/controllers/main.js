'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', 'editables', 'webservice', 'settings', 'messenger', 'file_handler_manager', 'pdf_file_manager', 'dataset', 'staging_dir', 'steps',  'labels',
	function ($scope, editables, webservice, settings, messenger, file_handler_manager, pdf_file_manager, dataset, staging_dir, steps, labels) {

		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		/* settings / version info */
		$scope.settings = settings;

		/* dataset */
		$scope.dataset = dataset;

		/* staging_dir */
		$scope.staging_dir = staging_dir;

        /* steps */
        $scope.steps = steps;

        /* labels */
        $scope.labels = labels;

		/* initialize */
        $scope.isLoading = true;

		$scope.init = function() {

		    function failFatal(err) {
		        console.error("fatal error", err);
                $scope.isLoading = false;
                steps.change("fatal");
                refreshView();
            }

            $scope.isLoading = true;

		    return settings.loadingPromise
                .then(() => {
                    webservice.get(["ojs_url", 'journalInfo'])
                        .then((journalInfo) => {
                            console.log("journalInfo", journalInfo);
                            dataset.setConstraints(journalInfo.data);
                            webservice.get('staging')
                                .then((stagingFolder) => {
                                    console.log("stagingFolder", stagingFolder);
                                    $scope.staging_dir.update(stagingFolder);
                                    $scope.isLoading = false;

                                    file_handler_manager.selectDefaultFileHandlers();

                                    refreshView();

                                })
                                .catch(failFatal);
                        })
                        .catch(failFatal);
                })
                .catch(failFatal)
		};


		/* restart */
		$scope.restart = function() {
			steps.isStarted = false;
			pdf_file_manager.reset();
			dataset.reset();
			$scope.init().then(function() {
                messenger.info('Restart Importer');
                steps.change('home');
                $scope.isLoading = false;
            });
		};


		/* start */
		$scope.start = function() {
            steps.change('documents');
            steps.isStarted = true;
		};

		/* some pdf things happen outside angular and need this */
        function refreshView() {
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }
		$scope.$on('refreshView', refreshView);



	}
]);
