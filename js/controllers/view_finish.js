/**
 * Created by pfranck on 20.04.17.
 */
angular

.module('controller.view_finish', [])

.controller('view_finish', ['$scope', 'settings', 'webservice', 'editables', 'journal', 'messenger',
	function($scope, settings, webservice, editables, journal, messenger) {

		$scope.init = function() {
			//
		};

		$scope.xml = false;
		$scope.done = false;
		$scope.dainstMetadata = {};

		$scope.renderXml = function() {
            messenger.error("reportMissingToZenon is currently not implemented");
		};

		$scope.uploadToOjs = function() {
			webservice.get('toOJS', journal.get(), function(response) {
				console.log(response);
				if (response.success) {
					$scope.done = true;
					$scope.reportMissingToZenon();
				}
			}, false, true);
		};

		$scope.makeOjsUrl = function(id) {
			return window.settings.ojs_url + 'index.php/'+ journal.data.ojs_journal_code + '/article/view/' + id;
		};

		$scope.isReady = function() {
			let articlesReady = $scope.journal.isReadyToUpload();
			let journalReady = $scope.journal.check();
			return articlesReady && journalReady && !$scope.done;
		};

		$scope.reportedToZenon = [];

		$scope.reportMissingToZenon = function() {
			messenger.error("reportMissingToZenon is currently not implemented");
		}

	}
]);
