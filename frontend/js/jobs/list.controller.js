angular.module("workbench.jobs")

    .controller("viewJobsList",  ["$scope", "jobs", "$interval",
        function($scope, jobs, $interval) {

            const refresh = () => jobs.refresh();

            refresh();
            let promise = $interval(refresh, 5000);

            $scope.jobs = jobs.list;

            $scope.$on("$destroy", () => $interval.cancel(promise));

        }
    ]);
