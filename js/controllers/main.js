'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', 'editables', 'webservice', 'settings', 'messenger', 'protocolregistry', 'documentsource', 'journal',
	function ($scope, editables, webservice, settings, messenger, protocolregistry, documentsource, journal) {

		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		/* protocols */
		function getLastProtocol() {
			try {
				let p = localStorage.getItem('protocol');
				if (angular.isFunction(protocolregistry.protocols[p].onSelect)) {
					protocolregistry.protocols[p].onSelect()
				}
				return p;
			} catch (e) {}
			return ''
		}
		$scope.protocols = {
			list: protocolregistry.protocols,
			current: getLastProtocol(),
            isSelected: function() {
			    return angular.isDefined($scope.protocol) && ($scope.protocol.id !== "none");
            }
		}
		$scope.protocol = {
			id: "none"
		}

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
        webservice.loading = true
		$scope.isLoading = function() {
            return webservice.loading;
        };

		$scope.init = function() {
			webservice.get('getRepository', {}, function(r) {
				if ((r.success === false) && (r.message === "Session locked")) { // @ TODO  do this in webservice!
					$scope.sessionLocked = true;
				} else if (r.success === true) {
					$scope.repository.update(r.repository);
                    if (settings.devMode() && (journal.data.importFilePath === "")) {
                        journal.data.importFilePath = $scope.repository.getFirstFile().path;
                    }
				}

				// this will be at a different place for the folowing,
				// when there are actually different backends to choose
				webservice.get('getBackendData', {backend: 'ojs2'}, function(r) {
					if (r.success === true) {
						journal.setConstraints(r.backendData.journals);
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
            getLastProtocol();
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
			    let i = -1;
                while (i++ < $scope.repository.list.length) {
                    if ($scope.repository.list[i].type === "file") {
                        return $scope.repository.list[i];
                    }
                }
            }
		}

		/* security */
		$scope.sec = webservice.sec;

		/* ctrl */

		$scope.isStarted = false;

		$scope.selectProtocol = function() {
			let toBeSelected = $scope.protocols.list[$scope.protocols.current];
			journal.reset();
			if (settings.devMode() && (journal.data.importFilePath === "")) {
                journal.data.importFilePath = $scope.repository.getFirstFile().path;
            }
			if (angular.isFunction(toBeSelected.onSelect)) {
				toBeSelected.onSelect();
			}
			$scope.protocol = $scope.protocols.list[$scope.protocols.current];
		}

		$scope.start = function() {
			//checkPW
			webservice.get('checkStart', {'file': $scope.journal.data.importFilePath, 'unlock': true, 'journal': $scope.journal.data}, function(response) {
				if (response.success) {
					$scope.protocol = $scope.protocols.list[$scope.protocols.current];
                    if (typeof $scope.protocol === "undefined") {
                        messenger.alert("Please select an import protocol", true);
                        return;
                    }
					localStorage.setItem('protocol', $scope.protocol.id);
					$scope.steps.change($scope.protocol.startView || 'overview');
					$scope.isStarted = true;
					if (angular.isFunction($scope.protocol.onInit)) {
						$scope.protocol.onInit();
					}
				} else {
					$scope.sec.password = '';
				}
			});
		}


		/* some pdf things happen outside angular and need this */
		$scope.$on('refreshView', function() {
			if(!$scope.$$phase) {
				$scope.$apply();
			}
		})

		/* forward events to current protocol */
		$scope.$on('gotFile', function($event, data) {
			if (angular.isFunction($scope.protocol.onGotFile)) {
				$scope.protocol.onGotFile(data)
			}
		})
		$scope.$on('gotAll', function($event, data) {
			if (angular.isFunction($scope.protocol.onAll)) {
				$scope.protocol.onAll(data)
			}
		})




	}
]);
