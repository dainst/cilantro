'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', 'editables', 'webservice', 'settings', 'messenger', 'protocolregistry', 'documentsource', 'dataset', 'repository', 'steps',  'labels',
	function ($scope, editables, webservice, settings, messenger, protocolregistry, documentsource, dataset, repository, steps, labels) {

		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		/* settings / version info */
		$scope.settings = settings;

		/* dataset */
		$scope.dataset = dataset;

		/* backendData */
		$scope.backendData = {}; //some backend specific data.. will be a far more complex object when there are different backends

		/* repository */
		$scope.repository = repository;

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
                                    $scope.repository.update(stagingFolder);
                                    $scope.protocols.selectLast();
                                    $scope.isLoading = false;

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
			messenger.content.stats = {};
			documentsource.reset();
			dataset.reset();
			$scope.init().then(function() {
                messenger.alert('Restart Importer', false);
                steps.change('home');
                $scope.protocols.selectLast();
                $scope.isLoading = false;
            });
		};

        /* protocols */ // @ TODO move to separate service
        $scope.protocols = {
            list: protocolregistry.protocols,
            current: -1,
            selectLast: function() {
                try {
                    let p = localStorage.getItem('protocol');
                    $scope.protocols.select(p);
                } catch (e) {
                    $scope.protocols.select();
                }
            },
            isSelected: function() {
                return angular.isDefined($scope.protocol) && ($scope.protocol.id !== "none");
            },
            select: function(id) {
                if (id) {
                    $scope.protocols.current = id;
                } else {
                    id = $scope.protocols.current;
                }
                console.log("select protocol " + id);
                $scope.protocol = $scope.protocols.list[id];
                dataset.reset();
                if (settings.devMode() && (dataset.data.importFilePath === "")) {
                    let file = $scope.repository.getFirstFile();
                    dataset.data.importFilePath = file ? file.path : '';
                }
                if ($scope.protocol && angular.isFunction($scope.protocol.onSelect)) {
                    $scope.protocol.onSelect()
                }
            },
            start: function() {
                if (!dataset.data.allow_upload_without_file && !dataset.data.importFilePath) {
                    messenger.alert("Please select a file or folder to upload!", true);
                    return false;
                }
                localStorage.setItem('protocol', $scope.protocol.id);
                console.log("start protocol " + $scope.protocol.id);
                steps.change($scope.protocol.startView || 'overview');
                if (angular.isFunction($scope.protocol.onInit)) {
                    $scope.protocol.onInit();
                }
                return true;
            }
        };
        $scope.protocol = {};

		/* ctrl */
		$scope.start = function() {
            if (!$scope.protocols.isSelected()) {
                messenger.alert("Please select an import protocol", true);
                return;
            }
            steps.isStarted = $scope.protocols.start();
		};

		/* some pdf things happen outside angular and need this */
        function refreshView() {
            if(!$scope.$$phase) {
                $scope.$apply();
            }
        }
		$scope.$on('refreshView', refreshView);

		/* forward events to current protocol */
		$scope.$on('gotFile', function($event, data) {
			if (angular.isFunction($scope.protocol.onGotFile)) {
				$scope.protocol.onGotFile(data)
			}
		});

		$scope.$on('gotAll', function($event, data) {
			if (angular.isFunction($scope.protocol.onGotAll)) {
				$scope.protocol.onGotAll(data)
			}
		});

	}
]);
