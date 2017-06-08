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
				var p = localStorage.getItem('protocol');
				if (angular.isFunction(protocolregistry.protocols[p].onSelect)) {
					protocolregistry.protocols[p].onSelect()
				}
				return p;
			} catch (e) {}
			return ''
		}
		$scope.protocols = {
			list: protocolregistry.protocols,
			current: getLastProtocol()
		}
		$scope.protocol = {
			id: "none",
			ready: false
		}

		/* settings / version info */
		$scope.settings = settings;

		/* journal */
		$scope.journal = journal;

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

				if (to == $scope.steps.current) {
					return;
				}

				console.log('Tab change to: ', to);
				//$scope.message.reset();
				$scope.steps.current = to;
			}
		}




		/* initialize */
		$scope.isInitialized = false;

		$scope.init = function() {
			webservice.get('getRepository', {}, function(r) {
				if ((r.success == false) && (r.message == "Session locked")) {
					$scope.sessionLocked = true;
				} else if (r.success == true) {
					$scope.repository.update(r.repository);
				}
				$scope.isInitialized = true;
			})
		}


		/* restart */
		$scope.restart = function() {
			$scope.isInitialized = false;
			$scope.isStarted = false;
			messenger.content.stats = {}
			documentsource.reset();
			journal.reset();
			$scope.init();
			$scope.protocol.onInit();
			messenger.alert('Restart Importer', false);
			$scope.steps.change('home');
		}


		/* document repository */
		$scope.repository = {
			list: [],
			update: function (repository, selected) {
				$scope.repository.list = webservice.repository = repository;
				if (typeof selected !== "undefined") {
					$scope.journal.data.importFilePath = selected;
				}
			}
		}

		/* security */
		$scope.sec = webservice.sec;

		/* ctrl */

		$scope.isStarted = false;

		$scope.selectProtocol = function() {
			var toBeSelected = $scope.protocols.list[$scope.protocols.current];
			journal.reset();
			if (angular.isFunction(toBeSelected.onSelect)) {
				toBeSelected.onSelect();
			}
		}

		$scope.start = function() {
			//checkPW
			webservice.get('checkStart', {'file': $scope.journal.data.importFilePath, 'unlock': true, 'journal': $scope.journal.data}, function(response) {
				if (response.success) {
					$scope.protocol = $scope.protocols.list[$scope.protocols.current];
					localStorage.setItem('protocol', $scope.protocol.id);
					$scope.steps.change($scope.protocol.startView || 'overview');
					$scope.isStarted = true;
					if (angular.isFunction($scope.protocol.onInit)) {
						$scope.protocol.onInit();
					} else {

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