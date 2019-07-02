angular.module('workbench.jobs.wizard')

    .controller('upload', ['$scope', '$rootScope','Upload', '$timeout', 'settings', 'webservice', 'messenger', 'stagingDir',
        function ($scope, $rootScope, Upload, $timeout, settings, webservice, messenger, stagingDir) {

            $scope.uploadedFiles = [];
            $scope.failedStagingFiles = {};
            $scope.uploadedFoldersAndFiles = [];
            $rootScope.Utils = {
                keys : Object.keys
            };

            function updateUploadedFoldersAndFiles(files){
                let folders = [];
                files.forEach(function(file){
                    if (file.path){
                        let folderName = file.path.split('/',1)[0];
                        if (!folders.includes(folderName)){
                            folders.push(folderName);
                            $scope.uploadedFoldersAndFiles.push("[DIR] " + folderName);
                        }
                    } else {
                        $scope.uploadedFoldersAndFiles.push(file.name);
                    }
                });
            }

            $scope.dropFile = function(f)  {
                console.log(f);
            };

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

            $scope.uploadFiles = function(files, uploadTask, callback) {
                if (!files || !files.length) {
                    $scope.invalidFiles = true;
                    return;
                }

                const headers = {"Content-Type" : 'multipart/form-data'};
                if (webservice.isLoggedIn()) {
                    headers.Authorization = "Basic " + webservice.userData.btoa;
                }

                //working with ngFileUpload directive
                Upload.upload({
                    url: settings.files_url,
                    method: 'POST',
                    headers: headers,
                    data: files,
                }).success(function(data, status, headers, config){
                    $scope.progress = 0;
                    $scope.evaluateStagingResponse(data.result);

                    //updateUploadedFoldersAndFiles(files);
                    //$scope.invalidFiles = false;

                    webservice.get('staging').then((stagingFolder) => {
                        $scope.stagingDir.update(stagingFolder);
                        $rootScope.$broadcast('refreshView');
                    });

                }).error(function(data, status, headers, config){
                    messenger.error("Upload failed.");
                    $scope.progress = 0;
                    console.log("Upload failed with Status ", status);
                    console.log("Upload headers:", headers);

                }).progress(function(event){
                    $scope.progress = Math.min(100, parseInt(100.0 * event.loaded / event.total));
                });
            };

    }])

    .filter('trustHtml', function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        };
    });
