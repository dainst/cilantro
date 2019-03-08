angular.module('workbench.jobs.wizard')

    .controller('viewFinish', ['$scope', '$rootScope', 'webservice', 'dataset', 'messenger', 'labels', 'jobs', '$state',
        function($scope, $rootScope, webservice, dataset, messenger, labels, jobs, $state) {

            $scope.dataset = dataset;
            $scope.labels = labels;

            $scope.done = false;

            $scope.run = () => {

                const param = dataset.get();

                webservice.get('job/ingest_journal', 'post', param).then(res => {
                    messenger.success("Job: " + res.status);
                    $scope.done = true;
                    $state.go('jobs.list');
                });
                webservice.get('job/jobs').then(result => result.forEach(job => jobs.updateJob(job)));
            };

            $scope.isReady = () => {
                const articlesReady = $scope.dataset.isReadyToUpload();
                const journalReady = $scope.dataset.check();
                return articlesReady && journalReady && !$scope.done;
            };

        }
    ]);
