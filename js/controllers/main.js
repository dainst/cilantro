'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', 'editables', 'webservice', 'settings', 'messenger', 'protocolregistry', 'documentsource', 'journal',
	function ($scope, editables, webservice, settings, messenger, protocolregistry, documentsource, journal) {

		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		/* settings / version info */
		$scope.settings = settings;

		/* journal */
		$scope.journal = journal;

		/* backendData */
		$scope.backendData = {} //some backend specific data.. will be a far more complex object when there are different backends

		/* step control */
		$scope.steps = {
			list: {
				"home": 	{
					"template": "partials/view_home.html",
					"title": "Start",
					"condition": function() {return !$scope.isStarted}
				},
				"restart": 	{
					"template": "partials/view_restart.html",
					"title": "Restart",
					"condition": function() {return $scope.isStarted}
				},
				"overview": {
					"template": "partials/view_overview.html",
					"title": "Overview",
					"condition": function() {return documentsource.ready}
				},
				"articles": {
					"template": "partials/view_articles.html",
					"title": "Articles",
					"condition": function() {return documentsource.ready}
				},
				"publish": 	{
					"template": "partials/view_finish.html",
					"title": "Publish",
					"condition": function() {return $scope.isStarted && documentsource.ready && journal.isReadyToUpload()}
				},
                "fatal": {
                    "template": "partials/view_fatal.html",
                    "title": "Fatal Error",
                    "condition": function(){return false}
                }
			},
			current:"home",
			change: function(to) {

				if (typeof $scope.steps.list[to] === "undefined") {
					console.warn('view ' + to + ' does not exist');
					return;
				}

				if (to === $scope.steps.current) {
					return;
				}

				console.log('Tab change to: ', to);
				//$scope.message.reset();
				$scope.steps.current = to;
			}
		}


		/* initialize */
		$scope.isLoading = true;

		$scope.init = function() {

		    function failFatal(err) {
                $scope.isLoading = false;
                $scope.steps.current = "fatal";
            }

            $scope.isLoading = true;

		    return settings.loadingPromise
                .then(() => {
                    webservice.get(["ojs_url", 'getJournalInfo'])
                        .then((journalInfo) => {
                            console.log("journalInfo", journalInfo);
                            journal.setConstraints(journalInfo);
                            webservice.get('staging')
                                .then((stagingFolder) => {
                                    console.log("stagingFolder", stagingFolder);
                                    $scope.repository.update(stagingFolder);
                                    $scope.protocols.selectLast();
                                    $scope.isLoading = false;
                                    $scope.$apply();
                                })
                                .catch(failFatal);
                        })
                        .catch(failFatal);
                })
                .catch(failFatal)
		};


		/* restart */
		$scope.restart = function() {
      		$scope.isLoading = true;
			$scope.isStarted = false;
			messenger.content.stats = {};
			documentsource.reset();
			journal.reset();
			$scope.init().then(function() {
                messenger.alert('Restart Importer', false);
                $scope.steps.change('home');
                $scope.protocols.selectLast();
                $scope.isLoading = false;
            });
		};


		/* document repository */
		$scope.repository = {
			list: [],
			update: function (repository, selected) {
				$scope.repository.list = webservice.repository = repository;
				if (typeof selected !== "undefined") {
					$scope.journal.data.importFilePath = selected;
				}
			},
            getFirstFile: function() {
			    if ($scope.repository.list.length < 1) {
			        return null;
                }
			    let i = -1;
                while (i++ < $scope.repository.list.length) {
                    if ($scope.repository.list[i].type === "file") {
                        return $scope.repository.list[i];
                    }
                }
            }
		}

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
                journal.reset();
                if (settings.devMode() && (journal.data.importFilePath === "")) {
                    let file = $scope.repository.getFirstFile();
                    journal.data.importFilePath = file ? file.path : '';
                }
                if ($scope.protocol && angular.isFunction($scope.protocol.onSelect)) {
                    $scope.protocol.onSelect()
                }
            },
            start: function() {
                if (!journal.data.allow_upload_without_file && !journal.data.importFilePath) {
                    messenger.alert("Please select a file or folder to upload!", true);
                    return false;
                }
                localStorage.setItem('protocol', $scope.protocol.id);
                console.log("start protocol " + $scope.protocol.id);
                $scope.steps.change($scope.protocol.startView || 'overview');
                if (angular.isFunction($scope.protocol.onInit)) {
                    $scope.protocol.onInit();
                }
                return true;
            }
        };
        $scope.protocol = {};


		/* security */
		$scope.sec = webservice.sec;

		/* ctrl */

		$scope.isStarted = false;

		$scope.start = function() {
            if (!$scope.protocols.isSelected()) {
                messenger.alert("Please select an import protocol", true);
                return;
            }
            $scope.isStarted = $scope.protocols.start();
		};

		/* some pdf things happen outside angular and need this */
		$scope.$on('refreshView', function() {
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		});

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
