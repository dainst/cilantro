angular.module('workbench.jobs.wizard')

    .controller('viewDocuments', ['$scope', 'fileManager', 'stagingDir', 'webservice',
        function($scope, fileManager, stagingDir, webservice) {

            $scope.fileHandlers = fileManager.fileHandlers;
            $scope.getSelectedFileHandler = fileManager.getFileHandler;
            $scope.selectFileHandler = fileManager.setFileHandler;
            $scope.stagingDir = stagingDir;
            $scope.filesListSelected = null;
            $scope.isReady = () => fileManager.ready;

            $scope.refreshStage = () => {
                webservice.get("staging")
                    .then((stagingFolder) => {
                        stagingDir.update(stagingFolder);
                        fileManager.reset();
                        $scope.refreshView();
                    })
                    .catch($scope.failFatal);
            };

            /*Opens file-editing-modals for 'type', currently only implemented for csv-files.*/
            $scope.newFile = function(type) {
                const fileHandler = fileManager.getFileHandler(type);
                return fileHandler.handleFile("");
            }

            $scope.refreshStage();

        }
    ]);
