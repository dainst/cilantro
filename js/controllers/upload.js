angular.module('controller.upload', ['ngFileUpload'])

.controller('upload', ['$scope', '$rootScope','Upload', '$timeout', 'settings', 'webservice', 'messenger', 'stagingDir',
    function ($scope, $rootScope, Upload, $timeout, settings, webservice, messenger, stagingDir) {

        $scope.uploadedFiles = [];
        $scope.uploadedFoldersAndFiles = [];

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

        $scope.uploadFiles = function(files, uploadTask, callback) {

            if (!files || !files.length) {
                $scope.invalidFiles = true;
                return;
            }

            const headers = {"Content-Type" : 'multipart/form-data'};
            if (angular.isDefined(settings.server_user) && angular.isDefined(settings.server_pass)) {
                headers.Authorization = "Basic " + window.btoa(settings.server_user + ":" + settings.server_pass);
            }

            //working with ngFileUpload directive
            Upload.upload({
                url: settings.files_url,
                method: 'POST',
                headers: headers,
                data: files,
            }).success(function(data, status, headers, config){
                $scope.progress = 0;
                $scope.uploadedFiles = $scope.uploadedFiles.concat(files);
                updateUploadedFoldersAndFiles(files);
                $scope.invalidFiles = false;
                console.log("files", files);
                webservice.get('staging').then((stagingFolder) => {
                    console.log("stagingFolder", stagingFolder);
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
