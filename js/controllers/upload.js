angular.module('controller.upload', ['ngFileUpload'])

.controller('upload', ['$scope', '$rootScope','Upload', '$timeout', 'settings', 'webservice', 'messenger', 'staging_dir',
	function ($scope, $rootScope, Upload, $timeout, settings, webservice, messenger, staging_dir) {


		$scope.uploadedFiles = [];


		$scope.dropFile = function(f)  {
			console.log(f);
		};

		$scope.uploadFiles = function(files, uploadTask, callback) {

		//folder upload: saving relative path of file and adding it to meta data, for rebuilding directory structure
		var paths = [];
		for (let i = 0; i < files.length; i++) {
			if (files[i].path){
				paths.push(files[i].path);
			} else {
				paths.push("undefined");
			}
			console.log(paths);
		}

		if (!files || !files.length) {
			$scope.invalidFiles = true;
			return;
		}

		Upload.upload({
			url: 'http://localhost:5000/staging',
			method: 'POST',
			headers: {"Content-Type" : 'multipart/form-data'},
			data:files,


		}).success(function(data, status, headers, config){
			if (data.success){
				$scope.uploadedFiles = $scope.uploadedFiles.concat(files);
				$scope.invalidFiles = false;
				webservice.get('staging')
                                .then((stagingFolder) => {
                                    console.log("stagingFolder", stagingFolder);
                                    $scope.staging_dir.update(stagingFolder);
                                    $rootScope.$broadcast('refreshView');
                                })
			}; 
		}).error(function(data, status, headers, config){
			messenger.error("Upload failed.");
      		$scope.progress = 0;
      		console.log("Upload failed with Status ", status);
      		console.log("Upload headers:", headers);

		});
 
	$scope.uploadCSV = function(files, callback) {
		$scope.uploadFiles(files, 'uploadCSV', callback)
	}
}

}]).filter('trustHtml', function($sce) {
	return function(val) {
		return $sce.trustAsHtml(val);
	};
});
