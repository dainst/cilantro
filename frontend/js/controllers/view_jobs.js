angular

    .module('controller.viewJobs', [])

    .controller('viewJobs', ['$scope', 'jobs',
        function($scope, jobs) {
            $scope.jobs = jobs.list;

            $scope.refresh = jobs.refresh;

        }
    ]);