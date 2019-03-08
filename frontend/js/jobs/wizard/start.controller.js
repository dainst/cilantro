angular.module('workbench.jobs.wizard')

    .controller('viewStart', ['$scope', 'dataset', 'labels', 'settings',
        function($scope, dataset, labels, settings) {
            $scope.dataset = dataset;
            $scope.labels = labels;
            $scope.settings = settings;
        }
    ]);
