angular.module("workbench.jobs.wizard")

    .controller("wizardController", ["$scope", "$location", "dataset", "webservice",
        function ($scope, $location, dataset, webservice) {

            webservice.get(["ojs_url", 'journalInfo'])
                .then((journalInfo) => dataset.setConstraints(journalInfo.data));

            $scope.isActive = (stepId) => $location.path().endsWith(stepId);

        }
    ]);
