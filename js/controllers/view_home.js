angular
.module('controller.view_home', [])

.controller('view_home', ['$scope', 'dataset', 'steps', 'labels', 'settings',
    function($scope, dataset, steps, labels, settings) {
        $scope.dataset = dataset;
        $scope.labels = labels;
        $scope.settings = settings;
        $scope.startBtn = () => {
            steps.change('documents');
            steps.isStarted = true;
        };
    }

]);