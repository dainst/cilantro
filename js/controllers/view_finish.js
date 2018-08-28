angular

.module('controller.viewFinish', [])

.controller('viewFinish', ['$scope', '$rootScope', 'webservice', 'dataset', 'messenger', 'labels', 'jobs', 'steps',
    function($scope, $rootScope, webservice, dataset, messenger, labels, jobs, steps) {

        $scope.dataset = dataset;
        $scope.labels = labels;

        $scope.done = false;

        $scope.run = () => {

            const param = dataset.get();

            webservice.get('job/ingest_journal', 'post', param).then(res => {
                messenger.success("Job: " + res.status);
                jobs.updateJob(res.job_id, res);
                $scope.done = true;
                steps.change('jobs');
                $rootScope.$broadcast('refreshView');
            })

        };

        $scope.isReady = () => {
            const articlesReady = $scope.dataset.isReadyToUpload();
            const journalReady = $scope.dataset.check();
            return articlesReady && journalReady && !$scope.done;
        };

    }
]);
