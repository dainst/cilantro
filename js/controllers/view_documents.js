angular

.module('controller.view_documents', [])

.controller('view_documents', ['$scope', 'file_manager', 'staging_dir', 'steps',
    function($scope, file_manager, staging_dir, steps) {

        $scope.fileHandlers = file_manager.fileHandlers;
        $scope.getSelectedFileHandler = file_manager.getFileHandler;
        $scope.selectFileHandler = file_manager.setFileHandler;
        $scope.staging_dir = staging_dir;
        $scope.filesListSelected = null;
        $scope.isReady = () => file_manager.ready;
        $scope.continue = () => steps.change('overview');
    }
]);
