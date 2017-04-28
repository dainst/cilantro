/**
 * Created by pfranck on 20.04.17.
 */
angular

.module('controller.view_finish', [])

.controller('view_finish', ['$scope', 'settings', 'webservice', 'editables', 'journal',
	function($scope, settings, webservice, editables, journal) {

		$scope.init = function() {
			console.log("T")
		}

		$scope.xml = false;
		$scope.done = false;
		$scope.dainstMetadata = {};

		$scope.renderXml = function() {
			webservice.get('makeXML', {journal: $scope.journal.data, articles: $scope.articles}, function(response) {
				$scope.xml = response.xml;
			});
		}

		$scope.uploadToOjs = function() {
			$scope.isInitialized = false;
			webservice.get('toOJS', {journal: $scope.journal.data, articles: $scope.articles}, function(response) {
				$scope.isInitialized = true;
				console.log(response);
				if (response.success) {
					$scope.done = true;
					$scope.dainstMetadata = response.dainstMetadata;
					//$scope.reportMissingToZenon(); @ TODO do it
				}
			});
		}

		$scope.makeOjsUrl = function(id) {
			return window.settings.ojs_url + 'index.php/'+ $scope.journal.data.ojs_journal_code + '/article/view/' + id;
		}

		$scope.isReady = function() {
			var articlesReady = journal.articleStats.data.undecided == 0;
			var journalReady = $scope.journal.check();
			return articlesReady && journalReady && !$scope.done;
		}
	}
]);
