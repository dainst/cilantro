'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', '$log', 'editables', 'webservice', 'settings', 'messenger', 'protocolregistry', 'documentsource', 'journal',
	function ($scope, $log, editables, webservice, settings, messenger, protocolregistry, documentsource, journal) {

		
		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		/* step control */
		$scope.steps = {
			list: {
				"home": 	{"template": "partials/view_home.html",			"title": "Start"},
				"overview": {"template": "partials/view_overview.html",		"title": "Documents overview"},
				"articles": {"template": "partials/view_articles.html",		"title": "Edit Articles"},
				"publish": 	{"template": "partials/view_finish.html",		"title": "Publish"}
			},
			current:"home",
			change: function(to) {
				$log.log('Tab change to: ', to);
				console.log('from m', $scope.articles);
				//$scope.message.reset();
				$scope.steps.current = to;
			}
		}

		/* protocols */
		$scope.protocols = {
			list: protocolregistry.protocols,
			current: "chiron_parted"
		}
		$scope.protocol = {
			id: "none"
		}

		/* current document source */
		$scope.documentSource = {
			name: "none"
		}

		/* journal */
		$scope.journal = journal;


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
		$scope.start = function() {
			//checkPW
			webservice.get('checkStart', {'file': $scope.journal.data.importFilePath, 'unlock': true, 'journal': $scope.journal.data}, function(response) {
				if (response.success) {
					$scope.getProtocol();
					$scope.steps.change($scope.protocol.startView || 'overview');
					$scope.protocol.init();
				} else {
					$scope.sec.password = '';
				}
			});
		}

		// get journal specific service
		$scope.getProtocol = function() {
			$log.log('load journal service ' +  $scope.protocols.current);
			$scope.protocol = $scope.protocols.list[$scope.protocols.current];
			$scope.protocol.main = $scope;
		};




		
	}
]);