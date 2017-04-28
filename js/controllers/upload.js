//inject angular file upload directives and services.
var app = angular.module('controller.upload', ['ngFileUpload']);

app.controller('upload', ['$scope', 'Upload', '$timeout', 'settings', 'webservice', 'messenger',
	function ($scope, Upload, $timeout, settings, webservice, messenger) {


    $scope.uploadedFiles = [];
    
    $scope.dropFile = function(f)  {
    	console.log(f);
    }
	
	$scope.uploadFiles = function (files) {
        $scope.files = files;
		messenger.ok();
        
        if (files && files.length) {
            Upload.upload({
                url: settings.server_url,
                data: {
                	task: "upload",
                    files: files,
                    data:  webservice.ojsisQuery()
                }
            // server success
            }).then(function (response) {
            	$scope.progress = 0;
            	console.log(response);
            	
            	if (typeof response.data === "string") {
            		messenger.message(response.data, true);
            		return;
            	}

				messenger.cast(response.data);

            	if (response.data.success == false) {
					return;
				} 
				
				$scope.result = response.data;

				$scope.uploadedFiles = $scope.uploadedFiles.concat(response.data.uploadedFiles);
				webservice.updateRepository(response.data.repository, response.data.uploadedFiles[response.data.uploadedFiles.length - 1]);
				
            // server error
            }, function (response) {
            	$scope.progress = 0;
                if (response.status > 0) {
					messenger.message(response.data, true);
                }
            // progress
            }, function (evt) {
                $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };
}]).filter('trustHtml', function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
});