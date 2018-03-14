/**
 * Created by pfranck on 20.04.17.
 */
angular

.module('controller.view_finish', [])

.controller('view_finish', ['$scope', 'settings', 'webservice', 'editables', 'journal',
	function($scope, settings, webservice, editables, journal) {

		$scope.init = function() {
			//
		}

		$scope.xml = false;
		$scope.done = false;
		$scope.dainstMetadata = {};

		$scope.renderXml = function() {
			console.log(journal.get());
			webservice.get('makeXML', journal.get(), function(response) {
				$scope.xml = response.xml;
			});
		}

		$scope.uploadToOjs = function() {
			webservice.get('toOJS', journal.get(), function(response) {
				console.log(response);
				if (response.success) {
					$scope.done = true;
					$scope.reportMissingToZenon();
				}
			}, false, true);
		}

		$scope.makeOjsUrl = function(id) {
			return window.settings.ojs_url + 'index.php/'+ journal.data.ojs_journal_code + '/article/view/' + id;
		}

		$scope.isReady = function() {
			let articlesReady = journal.articleStats.data.undecided === 0;
			let journalReady = $scope.journal.check();
			return articlesReady && journalReady && !$scope.done;
		}



		$scope.reportedToZenon = [];

		$scope.reportMissingToZenon = function() {
			console.log('creating zenon reports');
			angular.forEach(journal.articles, function(article) {
				if (article._.reportToZenon === true) {
					webservice.get('sendToZenon', journal.get(article), function(response) {
						if (response.success) {
							article._.zenonReport = settings.log_url + response.report;
							$scope.reportedToZenon.push(article);
							console.log($scope.reportedToZenon);
						}
						console.log(response);
					}, true);
				}
			});
		}


		$scope.getReportUrl = function() {
			return window.settings.log_url;
		}

	}
]);
