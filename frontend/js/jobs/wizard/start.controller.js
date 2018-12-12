angular
.module('controller.viewStart', [])

.controller('viewStart', ['$scope', 'dataset', 'steps', 'labels', 'settings',
    function($scope, dataset, steps, labels, settings) {
        $scope.dataset = dataset;
        $scope.labels = labels;
        $scope.settings = settings;
        $scope.startBtn = () => {
            steps.changeView('documents');
            steps.isStarted = true;
        };
    }

]);
