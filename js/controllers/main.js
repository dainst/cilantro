'use strict';

angular

.module('controller.main', [])

.controller('main',	['$scope', 'editables', 'webservice', 'settings', 'messenger', 'protocolregistry', 'documentsource', 'journal',
	function ($scope, editables, webservice, settings, messenger, protocolregistry, documentsource, journal) {

		
		/* debug */
		$scope.cacheKiller = '?nd=' + Date.now();

		/* protocols */
		$scope.protocols = {
			list: protocolregistry.protocols,
			current: "chiron_parted"
		}
		$scope.protocol = {
			id: "none",
			ready: false
		}

		/* current document source */
		$scope.documentSource = {
			name: "none"
		}

		/* journal */
		$scope.journal = journal; // @ TODO remove this?

		/* step control */
		$scope.steps = {
			list: {
				"home": 	{
					"template": "partials/view_home.html",
					"title": "Start",
					"condition": true
				},
				"overview": {
					"template": "partials/view_overview.html",
					"title": "Overview",
					"condition": $scope.protocol.ready
				},
				"articles": {
					"template": "partials/view_articles.html",
					"title": "Articles",
					"condition": $scope.protocol.ready
				},
				"publish": 	{
					"template": "partials/view_finish.html",
					"title": "Publish",
					"condition": $scope.protocol.ready && journal.articleStats.undecided == 0 && journal.articleStats.articles > 0
				}
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
			console.log('load journal service ' +  $scope.protocols.current);
			$scope.protocol = $scope.protocols.list[$scope.protocols.current];
			$scope.protocol.main = $scope;
		};

		/* some pdf things happen outside angular and need this */
		$scope.$on('refreshView', function() {
			console.log('REFRESH', $scope.protocol.ready);
			$scope.$apply();
		})


		
	}
]);