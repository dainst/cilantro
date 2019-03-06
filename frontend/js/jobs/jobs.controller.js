angular.module("workbench.jobs")

    .controller("viewJobs",  ["$scope", "jobs", "$interval", "steps",
        function($scope, jobs, $interval, steps) {

            const refresh = () => jobs.refresh();

            refresh();
            let promise = $interval(refresh, 5000);

            $scope.jobs = jobs.list;

            $scope.$on("$destroy", () => $interval.cancel(promise));

        }
    ]);
