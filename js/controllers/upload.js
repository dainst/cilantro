//inject angular file upload directives and services.
var app = angular.module('controller.upload', ['ngFileUpload']);

app.controller('upload', ['$scope', 'Upload', '$timeout', 'settings', 'webservice', 'messenger',
	function ($scope, Upload, $timeout, settings, webservice, messenger) {


    $scope.uploadedFiles = [];


    $scope.dropFile = function(f)  {
    	console.log(f);
    }

	$scope.uploadFiles = function(files, uploadTask, callback) {
		var i;
		var paths = [];
		for (i = 0; i < files.length; i++) {
				if (files[i].path){
					paths.push(files[i].path);
				} else {
					paths.push("undefined");
				}
				console.log(paths);
			}

				messenger.ok();

        if (!files || !files.length) {
					$scope.invalidFiles = true;
					return;
				}

        Upload.upload({
            url: settings.server_url,
            data: {
            	task: uploadTask || "upload",
                files: files,
                data:  webservice.ojsisQuery(),
								path: paths
            }

        }).then(
					function uploadSuccess(response) {
          	$scope.progress = 0;

          	if (typeof response.data === "string") {
          		messenger.message(response.data, true);
          		return;
          	}

						messenger.cast(response.data);

          	if (response.data.success === false) {
							return;
						}

						$scope.result = response.data;

						$scope.uploadedFiles = $scope.uploadedFiles.concat(response.data.uploadedFiles);

						if (typeof $scope.repository !== "undefined") { // because this controller is also used in context fo csv dialogue
							$scope.repository.update(response.data.repository, response.data.uploadedFiles[0]);
						}

						if (angular.isFunction(callback)) {
							callback(response)
						}

						$scope.invalidFiles = false;

          // server error
          },
					function uploadError(response) {
        		$scope.progress = 0;
            if (response.status > 0) {
							messenger.message(response.data, true);
            }
          // progress
				}, function uploadProgress(evt) {
            $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });


    };

	$scope.uploadCSV = function(files, callback) {
		$scope.uploadFiles(files, 'uploadCSV', callback)
	}
}]).filter('trustHtml', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});
