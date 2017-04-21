/**
 * Created by pfranck on 20.04.17.
 */
angular

.module('controller.view_finish', [])

.controller('view_finish', ['$scope', '$log', '$http', 'settings', 'pimportws', 'editables',
	function($scope, $log, $http, settings, pimportws, editables) {

		$scope.init = function() {
		}

		$scope.xml = {}
		$scope.done = false;
		$scope.dainstMetadata = {};

		$scope.renderXml = function() {
			pimportws.get('makeXML', {journal: $scope.journal.data, articles: $scope.articles}, function(response) {
				$scope.xml = response.xml;
			});
		}

		$scope.uploadToOjs = function() {
			$scope.server = {};
			$scope.isInitialized = false;
			pimportws.get('toOJS', {journal: $scope.journal.data, articles: $scope.articles}, function(response) {
				$scope.isInitialized = true;
				console.log(response);
				if (response.success) {
					$scope.done = true;
					$scope.dainstMetadata = response.dainstMetadata;
					//$scope.reportMissingToZenon(); @ TODO do it
				}
			});
		}

		$scope.countUnconfirmed = function() {
			var unconfimed = 0;
			for (var i; i < $scope.articles.length; i++) {
				if (!article._.confirmed) {
					unconfimed += 1;
				}
			}
			return unconfimed;
		}

		$scope.makeOjsUrl = function(id) {
			return window.settings.ojs_url + 'index.php/'+ $scope.journal.data.ojs_journal_code + '/article/view/' + id;
		}
		/*
		$scope.isObject = function(elem) {
			return (typeof elem === "object");
		}
		*/
		$scope.isReady = function() {
			var articlesReady = $scope.countUnconfirmed() == 0;
			var journalReady = $scope.journal.check();
			return articlesReady && journalReady && !$scope.done;
		}
	}
]);
