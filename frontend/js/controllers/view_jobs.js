angular

    .module('controller.viewJobs', [])

    .controller('viewJobs',  ['$scope', 'jobs', '$interval', 'steps',
        function($scope, jobs, $interval, steps) {

            const refresh = () => {
                function isJobFinished(job) {
                    return job[1].status == 1;
                }

                if (Object.entries(jobs.list).every(isJobFinished)) {
                    $interval.cancel(promise);
                }

                if(steps.current !== 'jobs') {
                    $interval.cancel(promise);
                }
                else {
                    jobs.refresh();
                }
            };

            let promise = $interval(refresh, 5000);

            $scope.jobs = jobs.list;

        }
    ]);
