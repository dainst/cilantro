angular.module("workbench.jobs.wizard")

    .controller("createController", ["$scope", "$location", "dataset", "webservice",
        function ($scope, $location, dataset, webservice) {

            $scope.steps = {
                "start": "Start",
                "documents": "Documents",
                "overview": "Overview",
                "subobjects": "Articles",
                "finish": "Publish"
            }

            webservice.get(["ojs_url", 'journalInfo'])
                .then((journalInfo) => dataset.setConstraints(journalInfo.data));

            $scope.isActive = (stepId) => $location.path().endsWith(stepId);

        }
    ]);
