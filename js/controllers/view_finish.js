/**
 * Created by pfranck on 20.04.17.
 */
angular

.module('controller.view_finish', [])

.controller('view_finish', ['$scope', 'settings', 'webservice', 'editables', 'dataset', 'messenger',
	function($scope, settings, webservice, editables, dataset, messenger) {

		$scope.init = function() {};

		$scope.done = false;

		$scope.run = function() {

		    let params = dataset.get();
            console.log(params);

			webservice.get('job/ingest_journal', 'post', params)
                .then(function(res) {
                    console.log("IT WORKED", res);

                    $scope.done = true;
                })
                .catch(function(e) {
                    console.error(e);
                })

		};

		$scope.isReady = function() {
			let articlesReady = $scope.dataset.isReadyToUpload();
			let journalReady = $scope.dataset.check();
			return articlesReady && journalReady && !$scope.done;
		};

		$scope.reportMissingToZenon = function() {
			messenger.error("reportMissingToZenon is currently not implemented");
		};

        $scope.renderXml = function() {
            messenger.error("reportMissingToZenon is currently not implemented");
        };

	}
]);
