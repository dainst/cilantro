/**
 * Created by pfranck on 20.04.17.
 */
angular

.module('controller.view_finish', [])

.controller('view_finish', ['$scope', 'webservice', 'dataset', 'messenger', 'labels',
    function($scope, webservice, dataset, messenger, labels) {

        $scope.dataset = dataset;
        $scope.labels = labels;

        $scope.done = false;

        $scope.run = function() {

            let param = dataset.get();
            console.log("POST PARAM", param);

            webservice.get('job/ingest_journal', 'post', param)
                .then(res => {
                    messenger.success(res.message);
                    $scope.done = true;
                }).catch(function() {});

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
