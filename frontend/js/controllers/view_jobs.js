angular

    .module('controller.viewJobs', [])

    .controller('viewJobs',  ['$scope', 'jobs', '$interval', 'steps',
        function($scope, jobs, $interval, steps) {

            const refresh = () => {
                if(steps.current != 'jobs'){
                    $interval.cancel(promise);
                }
                else {
                    jobs.refresh();
                }
            }

            let promise = $interval(refresh, 1000);

            $scope.jobs = jobs.list;

        }
    ]);