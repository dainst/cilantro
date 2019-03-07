angular.module("workbench.jobs.wizard")

    .controller("createController", ["$scope", "$location",
        function ($scope, $location) {

            $scope.steps = {
                "start": "Start",
                "documents": "Documents",
                "overview": "Overview",
                "subobjects": "Articles",
                "finish": "Publish"
            }

            $scope.isActive = (stepId) => $location.path().endsWith(stepId);

        }
    ]);
