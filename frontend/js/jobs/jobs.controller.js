angular

    .module('controller.viewJobs', [])

    .controller('viewJobs',  ['$scope', 'jobs', '$interval', 'steps',
        function($scope, jobs, $interval, steps) {

            const refresh = () => jobs.refresh();

            let promise = $interval(refresh, 5000);

            $scope.jobs = jobs.list;

        }
    ]);
