//inject angular file upload directives and services.
var app = angular.module('controller.upload', ['ngFileUpload']);

app.controller('upload', ['$scope', 'Upload', '$timeout', 'settings', 'pimportws', '$log', function ($scope, Upload, $timeout, settings, pimportws, $log) {

    $scope.errorMsg = '';
    $scope.warningsMsg = [];
    
    $scope.uploadedFiles = [];
    
    $scope.dropFile = function(f)  {
    	$log.log(f);
    }
	
	$scope.uploadFiles = function (files) {
        $scope.files = files;

        $scope.errorMsg = '';
        $scope.warningsMsg = [];
        
        if (files && files.length) {
            Upload.upload({
                url: settings.server_url,
                data: {
                	task: "upload",
                    files: files,
                    data:  pimportws.ojsisQuery()
                }
            // server success
            }).then(function (response) {
            	$scope.progress = 0;
            	$log.log(response);
            	$scope.warningsMsg = response.data.warnings;
            	
            	if (typeof response.data === "string") {
            		$scope.errorMsg = response.data;
            		return;
            	}
            	
				if (response.data.success == false) {
					$scope.errorMsg = response.data.message;
					return;
				} 
				
				$scope.result = response.data;
				if (!pimportws.uploadId) {
					pimportws.uploadId = response.data.uploadId;
				}
				if (pimportws.uploadId != response.data.uploadId) {
					$log.log("got new uploadID, that's so wrong", pimportws.uploadId, response.data.uploadId);
				}
				$scope.errorMsg = '';
				$scope.uploadedFiles = $scope.uploadedFiles.concat(response.data.uploadedFiles);
				
            // server error
            }, function (response) {
            	$scope.warningsMsg = [];
            	$scope.progress = 0;
                if (response.status > 0) {
                    $scope.errorMsg = response.data;
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