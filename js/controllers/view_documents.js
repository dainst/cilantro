angular

.module('controller.viewDocuments', [])

.controller('viewDocuments', ['$scope', 'fileManager', 'stagingDir', 'steps',
    function($scope, fileManager, stagingDir, steps) {

        $scope.fileHandlers = fileManager.fileHandlers;
        $scope.getSelectedFileHandler = fileManager.getFileHandler;
        $scope.selectFileHandler = fileManager.setFileHandler;
        $scope.stagingDir = stagingDir;
        $scope.filesListSelected = null;
        $scope.isReady = () => fileManager.ready;
        $scope.continue = () => steps.change('overview');

        /*Opens file-editing-modals for 'type', currently only implemented for csv-files.*/
        $scope.newFile = function(type) {
            const fileHandler = fileManager.getFileHandler(type);
            return fileHandler.handleFile("");
        }
    }
]);
