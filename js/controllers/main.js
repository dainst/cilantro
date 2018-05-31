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
				"documents": {
					"template": "partials/view_documents.html",
					"title": "Documents",
					"condition": function() {return documentsource.ready}
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
					"condition": function() {return $scope.isStarted && documentsource.ready && journal.isReadyToUpload()}}
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
		$scope.isLoading = function() {
            return webservice.loading;
        };

		$scope.init = function() {
			webservice.get('getRepository', {}, function(r) {
				if ((r.success === false) && (r.message === "Session locked")) { // @ TODO  do this in webservice!
					$scope.sessionLocked = true;
				} else if (r.success === true) {
					$scope.repository.update(r.repository);
				}

				// this will be at a different place for the folowing,
				// when there are actually different backends to choose
				webservice.get('getBackendData', {backend: 'ojs2'}, function(r) {
					if (r.success === true) {
						journal.setConstraints(r.backendData.journals);
                        $scope.protocols.selectLast();
					}
				},false,true);
			});
		}


		/* restart */
		$scope.restart = function() {
      webservice.loading = true;
			$scope.isStarted = false;
			messenger.content.stats = {};
			documentsource.reset();
			journal.reset();
			$scope.init();
			messenger.alert('Restart Importer', false);
			$scope.steps.change('home');
      $scope.protocols.selectLast();
      webservice.loading = false;
		}


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
			//checkPW
			webservice.get('checkStart', {'file': $scope.journal.data.importFilePath, 'unlock': true, 'journal': $scope.journal.data}, function(response) {
				if (response.success) {
                    if (!$scope.protocols.isSelected()) {
                        messenger.alert("Please select an import protocol", true);
                        return;
                    }
                    $scope.isStarted = $scope.protocols.start();
				} else {
					$scope.sec.password = '';
				}
			});
		}

		/*checking password for first time login - to enable data input on first page */
		$scope.checkPassword = function() {
			//checkPw
			webservice.get('checkPassword', {}, function(response) {
					if(response.success){
						$scope.password_checked = true;
					}
			});
		}

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
