angular.module('workbench.jobs.wizard')

    .controller('upload', ['$scope', '$rootScope','Upload', '$timeout', 'settings', 'webservice', 'messenger', 'stagingDir',
        function ($scope, $rootScope, Upload, $timeout, settings, webservice, messenger, stagingDir) {
            $rootScope.Utils = {
                keys : Object.keys
            };

            $scope.uploadedFiles = [];
            $scope.failedStagingFiles = {};

            $scope.evaluateStagingResponse = function(result) {
                for(let filename in result){
                    if(result[filename].success === true){
                        $scope.uploadedFiles.push(filename);
                    }
                    else{
                        let errorCode = result[filename].error.code;
                        if(errorCode in $scope.failedStagingFiles){
                            $scope.failedStagingFiles[errorCode].push(filename);
                        } else {
                            $scope.failedStagingFiles[errorCode] = [filename];
                        }
                    }
                }
            };

            $scope.resetUploadStatus = function(){
                $scope.uploadStatusCode = null;
                $scope.uploadStatusMessage = null;
            };

            $scope.setUploadStatus = function(code){
                $scope.uploadStatusCode = code;
                // TODO: Add additional status messages for different codes?
                switch (code){
                    case 200:
                        $scope.uploadStatusMessage = "Upload successful";
                        break;
                    default:
                        $scope.uploadStatusMessage = "Upload failed";
                        break;
                }
            };

            $scope.uploadFiles = function(files, uploadTask, callback) {

                const headers = {"Content-Type" : 'multipart/form-data'};
                if (webservice.isLoggedIn()) {
                    headers.Authorization = "Basic " + webservice.userData.btoa;
                }

                $scope.uploadedFiles = [];
                $scope.failedStagingFiles = {};
                $scope.resetUploadStatus();

                //working with ngFileUpload directive
                Upload.upload({
                    url: settings.files_url,
                    method: 'POST',
                    headers: headers,
                    data: files,
                }).success(function(data, status, headers, config){
                    $scope.progress = 0;
                    $scope.uploadStatus = status;
                    $scope.evaluateStagingResponse(data.result);
                    $scope.setUploadStatus(status);

                    webservice.get('staging').then((stagingFolder) => {
                        $scope.stagingDir.update(stagingFolder);
                        $rootScope.$broadcast('refreshView');
                    });

                }).error(function(data, status, headers, config){
                    $scope.uploadStatus = status;
                    $scope.progress = 0;
                    $scope.setUploadStatus(status);

                }).progress(function(event){
                    $scope.progress = Math.min(100, Math.floor(100.0 * event.loaded / event.total));
                });
            };

    }]);
